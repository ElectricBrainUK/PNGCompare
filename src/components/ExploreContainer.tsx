import React from 'react';
import './ExploreContainer.css';

const pixelmatch = require('pixelmatch');

// @ts-ignore
const sprites = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/);
// @ts-ignore
const spriteFiles = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/).keys();

interface ContainerProps {
}


function createDisplay(comparisonCanvas: HTMLCanvasElement, strings: string[], attributefound: any = true) {
    let cardElement = document.createElement("IonCard"); //todo doesnt work
    let cardContent = document.createElement("IonCardContent");
    cardElement.append(cardContent);
    cardContent.append(comparisonCanvas);
    let link = document.createElement("a");
    let textElement = document.createElement("p");
    if (attributefound === true) {
        textElement.append("Attribution");
        link.href = "https://github.com/ElectricBrainUK/PNGCompare/blob/master/downloads/" + strings.join('/').replace("./", "") + "?raw=true";
        link.target = "_blank";
    } else {
        textElement.append("No attribution could be found");
    }
    link.appendChild(textElement);
    cardContent.append(link);

    // @ts-ignore
    document.getElementById("container").appendChild(cardElement);
}

const onChangeHandler = async (event: any) => {
    // @ts-ignore
    let files = [], matches = [];
    for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        if (file.name.includes(".png")) {
            files.push(file);
        }
    }

    let loaded : any = {};

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
                if (comparisonImage === null || comparisonCanvas === null) {
                    continue;
                }

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
                        let strings = spriteFiles[j].split('/');
                        strings[strings.length - 1] = "Attribution.txt";
                        matches.push({
                            file: spriteFiles[j],
                            attribution: strings.join('/'),
                        });
                        // @ts-ignore
                        console.log(matches);

                        createDisplay(comparisonCanvas, strings);
                    }

                    if (loaded[i] === spriteFiles.length) {
                        createDisplay(comparisonCanvas, [], false);
                    }
                };
            }
        };
    }
};

const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


const ExploreContainer: React.FC<ContainerProps> = () => {
    return (
        <div id="container" className="container">
            <input type="file" name="file" onChange={onChangeHandler} multiple/>
        </div>
    );
};

export default ExploreContainer;
