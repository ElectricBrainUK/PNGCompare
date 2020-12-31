import React, {useEffect, useState} from 'react';
import './ExploreContainer.css';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonProgressBar} from "@ionic/react";

const pixelmatch = require('pixelmatch');

// @ts-ignore
const sprites = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/);
// @ts-ignore
const spriteFiles = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/).keys();

let setLoadingFiles: any;
let setUnloadingFiles: any;

let files: any = [];

let loadFiles = () => {
        let loading = 0;
        let loaded = 0;
        for (let j = 0; j < spriteFiles.length; j++) {
            let image = sprites(spriteFiles[j]);

            let stored = document.createElement("canvas");
            let storedImage = new Image();
            if (stored === null || storedImage === null) {
                continue;
            }

            let storedContext: any = stored.getContext('2d');
            storedImage.src = image;

            loading++;
            setUnloadingFiles(loading);

            files[j] = {
                image: spriteFiles[j]
            };

            storedImage.onload = () => {
                stored.width = storedImage.width;
                stored.height = storedImage.height;

                storedContext.drawImage(storedImage, 0, 0);

                files[j].data = storedContext.getImageData(0, 0, storedImage.width, storedImage.height).data;
                files[j].width = storedImage.width;
                files[j].height = storedImage.height;

                loaded++;
                setLoadingFiles(loaded + 1);
            }
        }
    }
;

interface ContainerProps {
}

const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

let loading = false;

const ExploreContainer: React.FC<ContainerProps> = () => {
    const [results, setResult] = useState({});
    const [loadedFiles, setLoaded] = useState(0);
    const [unloadedFiles, setUnloaded] = useState(0);

    useEffect(() => {
        if (!loading) {
            loading = true;
            setLoadingFiles = setLoaded;
            setUnloadingFiles = setUnloaded;
            setTimeout(loadFiles, 3000);
        }
    });

    const onChangeHandler = async (event: any) => {
        event.persist();
        let uploadedFiles: any = [];
        let uploadsToLoad = 0;
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            if (file.name.includes(".png")) {
                uploadsToLoad++;
                let comparisonCanvas = document.createElement("canvas");

                let comparisonImage: any = new Image();
                comparisonImage.src = await toBase64(file);

                let comparisonContext: any = comparisonCanvas.getContext('2d');

                comparisonImage.onload = () => {
                    comparisonCanvas.width = comparisonImage.width;
                    comparisonCanvas.height = comparisonImage.height;

                    comparisonContext.drawImage(comparisonImage, 0, 0);

                    let comparisonImageData = comparisonContext.getImageData(0, 0, comparisonImage.width, comparisonImage.height);

                    uploadedFiles.push({
                        width: comparisonImage.width,
                        height: comparisonImage.height,
                        src: comparisonImage.src,
                        data: comparisonImageData.data,
                        name: file.name
                    });
                    if (uploadsToLoad <= uploadedFiles.length) {
                        findMatches(uploadedFiles);
                    }
                };
            }
        }
    };

    const findMatches = (uploadedFiles: any[]) => {
        let loaded: any = {};
        let found: any = [];

        for (let j = 0; j < files.length; j++) {
            let checking = files[j];
            if (checking === null) {
                continue;
            }

            for (let i = 0; i < uploadedFiles.length; i++) {
                let comparisonImage = uploadedFiles[i];
                if (!loaded[i]) {
                    loaded[i] = 0;
                }

                loaded[i]++;
                if (found[i]) {
                    continue;
                }

                if (comparisonImage.width !== checking.width || comparisonImage.height !== checking.width) {
                    continue;
                }

                let resultCanvas = document.createElement("canvas");

                resultCanvas.width = checking.width;
                resultCanvas.height = checking.height;

                let diffContext = resultCanvas.getContext('2d');

                if (diffContext === null) {
                    continue;
                }

                const diff = diffContext.createImageData(resultCanvas.width, resultCanvas.height);
                let numDiffPixels = 11;
                try {
                    numDiffPixels = pixelmatch(comparisonImage.data, checking.data, diff.data, resultCanvas.width, resultCanvas.height, {threshold: 0.1});
                } catch (e) {
                    continue;
                }
                diffContext.putImageData(diff, 0, 0);

                if (found[i]) {
                    continue;
                }

                if (numDiffPixels < 10) {
                    found[i] = true;
                    let strings = spriteFiles[j].split('/');
                    strings[strings.length - 1] = "Attribution.txt";
                    let strings2 = spriteFiles[j].split('/');
                    strings2[strings2.length - 1] = "opengameart.json";

                    let resultTemp: any = results;
                    // @ts-ignore
                    resultTemp[uploadedFiles[i].name] = {
                        file: spriteFiles[j],
                        attribution: "No attribution could be found",
                        src: comparisonImage.src,
                        name: uploadedFiles[i].name
                    };
                    setResult({...resultTemp});

                    try {
                        fetch("https://raw.githubusercontent.com/ElectricBrainUK/PNGCompare/master/downloads/" + strings.join('/').replace("./", "")).then((res) => {
                            let resultTemp: any = results;
                            resultTemp[uploadedFiles[i].name].attribution = strings.join('/');
                            setResult({...resultTemp});
                        }).catch(err => {
                            console.log(err);
                        });
                    } catch (e) {
                        console.log(e);
                    }

                    try {
                        fetch("https://raw.githubusercontent.com/ElectricBrainUK/PNGCompare/master/downloads/" + strings2.join('/').replace("./", "")).then((openURL) => {
                            openURL.json().then(json => {
                                let resultTemp: any = results;
                                resultTemp[uploadedFiles[i].name].url = json.url;
                                resultTemp[uploadedFiles[i].name].username = json.username;
                                resultTemp[uploadedFiles[i].name].ogName = json.name;
                                setResult({...resultTemp});
                            });
                        }).catch(err => {
                            console.log(err);
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }

                // @ts-ignore
                if (loaded[i] === spriteFiles.length && !results[uploadedFiles[i]] && !found[i]) {
                    let resultTemp: any = results;
                    resultTemp[uploadedFiles[i].name] = {
                        file: spriteFiles[j],
                        attribution: "No attribution could be found",
                        src: comparisonImage.src,
                        name: uploadedFiles[i].name
                    };

                    setResult({...resultTemp});
                }
            }
        }
    };

    let cards = Object.keys(results).map(key => {
        // @ts-ignore
        let result = results[key];
        return <IonCard key={result.name} style={{maxWidth: "300px", minWidth: "300px", display: "inline-block"}}>
            <img src={result.src} alt={""}/>
            <IonCardHeader>
                <IonCardTitle>{result.name}</IonCardTitle>
                <IonCardTitle>{result.username}</IonCardTitle>
                <IonCardTitle>{result.ogName}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonCol>
                    {
                        result.attribution && result.attribution !== "No attribution could be found" ?
                            <a rel="noopener noreferrer" target="_blank"
                               href={"https://raw.githubusercontent.com/ElectricBrainUK/PNGCompare/master/downloads/" + result.attribution.replace("./", "")}>
                                Attribution
                            </a>
                            :
                            <p>No attribution could be found</p>
                    }
                </IonCol>
                <IonCol>
                    {
                        result.url ?
                            <a rel="noopener noreferrer" target="_blank" href={result.url}>Link</a> : <></>
                    }
                </IonCol>
            </IonCardContent>
        </IonCard>
    });

    return (
        <div id="container">
            <IonProgressBar value={loadedFiles / unloadedFiles}></IonProgressBar>
            <input accept="image/x-png" type="file" name="file" onChange={onChangeHandler} multiple
                   disabled={loadedFiles !== unloadedFiles || unloadedFiles === 0}/>
            {
                cards
            }
        </div>
    );
};

export default ExploreContainer;
