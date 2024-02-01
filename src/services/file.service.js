import * as path from 'path';
import * as fs from 'fs';

export class FileService {

	async imageToWebp(image) {
		try {
			const newFileName = `${image.filename}.webp`;
			const newFilePath = path.join(path.dirname(image.path), newFileName);

			fs.renameSync(image.path, newFilePath);
			image.path = newFilePath;

			return image.path;
		} catch (error) {
			throw error;
		}
	}

	async deleteFile(imagePath) {
		const baseDir = process.cwd();
		const fullOldImagePath = path.join(baseDir, imagePath);

		if (!fs.existsSync(fullOldImagePath)) {
			console.log(`File not found: ${imagePath}`);
			return false;
		}

		try {
			fs.unlinkSync(fullOldImagePath);
			return true;
		} catch (error) {
			throw new Error(`Error deleting image: ${error.message}`);
		}
	}


}