const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});  

const getCloudinaryStickers = async (req, res) => {
    try {
        // Search for resources in the specified folder
        const { resources } = await cloudinary.search
          .expression('folder:Stickers-library') // IMPORTANT: Make sure this is your exact folder name in Cloudinary
          .sort_by('public_id', 'desc')
          .execute();
    
        // We must use `file.secure_url` to get the full image link for the 'src' property.
        const stickers = resources.map(file => ({
          id: file.public_id,
          src: file.secure_url, // This provides the full HTTPS URL for the image
        }));
    
        // Send the correctly formatted array as a JSON response
        res.json(stickers);
    
      } catch (error) {
        console.error('Error fetching stickers from Cloudinary:', error);
        res.status(500).json({ error: 'Failed to fetch stickers' });
      }
}

module.exports = {
    getCloudinaryStickers
};