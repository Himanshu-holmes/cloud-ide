
const path = require('path');
const { IMAGE_NAME } = require('../../server/src/constant');


async function containerizeServerRepo(docker) {
  try {
    const imageName = IMAGE_NAME;
    const serverRepoPath = path.resolve(__dirname, '../../server'); // Adjust if `server` is not in the parent directory
    console.log(serverRepoPath)

    // // Check if the image already exists
    const images = await docker.listImages();
    console.log("docker list",images)
    const imageExists = images.some(image => image.RepoTags && image.RepoTags.includes(`${imageName}:latest`));
console.log("isImageExist",imageExists)
    if (!imageExists) {
      console.log('Image not found. Building the image...');

    //   // Build the Docker image if it doesn't exist
      const stream = await docker.buildImage({
        context:serverRepoPath,
        src: ['Dockerfile',"package.json","src","server.js","user"]
      },
        
         { t: imageName});

        // Log and handle stream events
        stream.on('data', data => process.stdout.write(data.toString()));
        stream.on('error', err => console.error('Stream error:', err));

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      console.log('Image built successfully.');
    } else {
      console.log('Image already exists. Skipping build.');
    }


  } catch (error) {
    console.error('Error:', error);
  }
}


module.exports = {
    containerizeServerRepo
}