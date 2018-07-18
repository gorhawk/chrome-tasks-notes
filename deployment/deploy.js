const cp = require('cpy');
const zipdir = require('zip-dir');

const zipDirToFile = async (directory, targetFilename) => (
    new Promise(resolve => {
        zipdir(directory, { saveTo: targetFilename }, (err, buffer) => (
            resolve()
        ))
    })
);

(async () => {
    const deploymentPath = 'prod/'
    const opts = { parents: true }
    const packedFilename = 'packed_extension.zip'
    const prodFiles = [
        '_locales',
        'assets',
        'dist',
        'popup.html',
        'index.html',
        'manifest.json',
        'popup.js'
    ]

    console.log('Deploying...')
    await cp(prodFiles, deploymentPath, opts)
    console.log('Deployed.')

    console.log(`Zipping into "${packedFilename}"...`)
    await zipDirToFile('prod', packedFilename)
    console.log(`Zipped to "${packedFilename}"!`)
})()