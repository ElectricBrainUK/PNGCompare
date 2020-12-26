import React, {useState} from 'react';
import './ExploreContainer.css';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol} from "@ionic/react";

const pixelmatch = require('pixelmatch');

// @ts-ignore
const sprites = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/);
// @ts-ignore
const spriteFiles = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/).keys();

interface ContainerProps {
}

const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const ExploreContainer: React.FC<ContainerProps> = () => {
    const [results, setResult] = useState({});

    const onChangeHandler = async (event: any) => {
        let files: any = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            if (file.name.includes(".png")) {
                files.push(file);
            }
        }

        let loaded: any = {};
        let found: any = [];

        for (let j = 0; j < spriteFiles.length; j++) {
            let image = sprites(spriteFiles[j]);

            let stored = document.createElement("canvas");
            let storedImage = new Image();
            if (stored === null || storedImage === null) {
                continue;
            }

            let storedContext = stored.getContext('2d');
            storedImage.src = image;

            storedImage.onload = async function () {
                const width = storedImage.width, height = storedImage.height;
                stored.width = width;
                stored.height = height;

                // @ts-ignore
                storedContext.drawImage(storedImage, 0, 0);

                // @ts-ignore
                var storedImageData = storedContext.getImageData(0, 0, width, height);

                for (let i = 0; i < files.length; i++) {
                    if (!loaded[i]) {
                        loaded[i] = 0;
                    }
                    let comparisonCanvas = document.createElement("canvas");
                    comparisonCanvas.width = width;
                    comparisonCanvas.height = height;

                    let comparisonImage = new Image();
                    let comparisonContext = comparisonCanvas.getContext('2d');
                    // @ts-ignore
                    comparisonImage.src = await toBase64(files[i]);

                    comparisonImage.onload = function () {
                        loaded[i]++;
                        // @ts-ignore
                        comparisonContext.drawImage(comparisonImage, 0, 0);

                        // @ts-ignore
                        let comparisonImageData = comparisonContext.getImageData(0, 0, width, height);


                        let resultCanvas = document.createElement("canvas");

                        resultCanvas.width = width;
                        resultCanvas.height = height;

                        let diffContext = resultCanvas.getContext('2d');

                        if (diffContext === null) {
                            return;
                        }

                        const diff = diffContext.createImageData(width, height);
                        const numDiffPixels = pixelmatch(comparisonImageData.data, storedImageData.data, diff.data, width, height, {threshold: 0.1});
                        diffContext.putImageData(diff, 0, 0);

                        if (numDiffPixels < 10) {
                            found[i] = true;
                            let strings = spriteFiles[j].split('/');
                            strings[strings.length - 1] = "Attribution.txt";
                            let strings2 = spriteFiles[j].split('/');
                            strings2[strings2.length - 1] = "opengameart.json";

                            let resultTemp: any = results;
                            // @ts-ignore
                            resultTemp[files[i].name] = {
                                file: spriteFiles[j],
                                attribution: "No attribution could be found",
                                src: comparisonImage.src,
                                name: files[i].name
                            };
                            setResult({...resultTemp});

                            fetch("https://raw.githubusercontent.com/ElectricBrainUK/PNGCompare/master/downloads/" + strings.join('/').replace("./", "")).then((res) => {
                                let resultTemp: any = results;
                                resultTemp[files[i].name].attribution = strings.join('/');
                                setResult({...resultTemp});
                            });

                            fetch("https://raw.githubusercontent.com/ElectricBrainUK/PNGCompare/master/downloads/" + strings2.join('/').replace("./", "")).then((openURL) => {
                                openURL.json().then(json => {
                                    let resultTemp: any = results;
                                    // @ts-ignore
                                    resultTemp[files[i].name].url = json.url;
                                    setResult({...resultTemp});
                                });
                            }).catch(err => {
                                console.log(err);
                            });
                        }

                        // @ts-ignore
                        if (loaded[i] === spriteFiles.length && !results[files[i]] && !found[i]) {
                            let resultTemp: any = results;
                            resultTemp[files[i].name] = {
                                file: spriteFiles[j],
                                attribution: "No attribution could be found",
                                src: comparisonImage.src,
                                name: files[i].name
                            };

                            setResult({...resultTemp});
                        }
                    };
                }
            };
        }
    };

    let cards = Object.keys(results).map(key => {
        // @ts-ignore
        let result = results[key];
        return <IonCard key={result.name} style={{maxWidth: "300px", minWidth: "300px", display: "inline-block"}}>
            <img src={result.src} alt={""}/>
            <IonCardHeader>
                <IonCardTitle>{result.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonCol>
                    {
                        result.attribution !== "No attribution could be found" ?
                            <a rel="noopener noreferrer" target="_blank" href={"https://github.com/ElectricBrainUK/PNGCompare/blob/master/downloads/" + result.attribution.replace("./", "") + "?raw=true"}>
                                Attribution
                            </a>
                            :
                            <p>No attribution could be found</p>
                    }
                </IonCol>
                <IonCol>
                    {
                        result.url ?
                        <a rel="noopener noreferrer"  target="_blank" href={result.url}>Link</a> : <></>
                    }
                </IonCol>
            </IonCardContent>
        </IonCard>
    });

    console.log(results);

    return (
        <div id="container">
            <input accept="image/x-png" type="file" name="file" onChange={onChangeHandler} multiple/>
            {
                cards
            }
        </div>
    );
};

export default ExploreContainer;
