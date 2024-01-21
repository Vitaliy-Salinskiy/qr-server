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


}