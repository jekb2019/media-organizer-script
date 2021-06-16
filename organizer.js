// import modules
const fs = require('fs');
const path = require('path');

// get input from command line
const basePath = path.join(__dirname, process.argv[2]);

const createFolder = (parentPath, folderName) => {
    // check if folder already exists
    const targetPath = path.join(parentPath, folderName);

    if(fs.existsSync(targetPath)) {
        // console.info(`${targetPath} already exsists`);
        return targetPath;
    }
    fs.promises.mkdir(targetPath);

    return targetPath;
}

const videoPath = createFolder(basePath, 'videos');
const capturedPath = createFolder(basePath, 'captured');
const duplicatedPath = createFolder(basePath, 'duplicated');

// move file from "from" to "to"
const moveFile = (from, to) => {
    return fs.promises.rename(from, to)
        .then(()=>console.log(`${from} --> ${to}`))
        .catch(()=>console.log('cannot move file'))
}

const collectFiles = (fileName) => {
    switch(path.extname(fileName)) {
        case '.mp4':
        case '.mov':
            moveFile(path.join(basePath, fileName), path.join(videoPath ,fileName));
            break;
        case '.png':
        case '.aae':
            moveFile(path.join(basePath, fileName), path.join(capturedPath ,fileName));
            break;
        default:
            if(fileName.startsWith('IMG_E')) {
                moveFile(path.join(basePath, fileName), path.join(duplicatedPath ,fileName));
            };
    }
}

// Read the unorganized media folder and sort
fs.promises.readdir(basePath)
    .then(data => {
        data.forEach(file => {
            collectFiles(file)
        })
    })
    .catch(console.error);