import React from 'react';
import './ExploreContainer.css';

const pixelmatch = require('pixelmatch');

// @ts-ignore
const sprites = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/);
// @ts-ignore
const spriteFiles = require.context("../../downloads", true, /\.(png|jpe?g|svg)$/).keys();

interface ContainerProps {
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
            // @ts-ignore
            storedContext.drawImage(storedImage, 0, 0);

            // @ts-ignore
            const width = storedContext.canvas.width, height = storedContext.canvas.height;
            // @ts-ignore
            var storedImageData = storedContext.getImageData(0, 0, width, height);

            for (let i = 0; i < files.length; i++) {
                let comparisonCanvas = document.createElement("canvas");
                let comparisonImage = new Image();
                if (comparisonImage === null || comparisonCanvas === null) {
                    continue;
                }

                let comparisonContext = comparisonCanvas.getContext('2d');
                // @ts-ignore
                comparisonImage.src = await toBase64(files[i]);

                comparisonImage.onload = function () {
                    // @ts-ignore
                    comparisonContext.drawImage(comparisonImage, 0, 0);

                    // @ts-ignore
                    let comparisonImageData = comparisonContext.getImageData(0, 0, width, height);


                    let resultCanvas = document.createElement("canvas");
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

                        fetch(strings.join('/')).then(res => {
                            res.text().then(text => {
                                // @ts-ignore
                                document.getElementById("container").appendChild(comparisonCanvas);
                                console.log(text);
                            })
                        })
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
