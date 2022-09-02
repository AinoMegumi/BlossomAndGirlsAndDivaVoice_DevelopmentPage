const fs = require('fs');
const MimeTypeReg = new RegExp('^audio/*[a-zA-Z0-9]{1,}$');

module.exports = {
    /**
     * 投稿された全ファイルを検査する
     * @param {{ fieldname: string, originalname: string, encoding: string, mimetype: string, destination: string, filename: string, path: string. size: number }[]} FileInformations
     */
    deleteAll: FileInformations => {
        FileInformations.forEach(f => {
            if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
    },
    /**
     * 投稿された全ファイルのMimeTypeを検査し、オーディオファイル以外が混ざっているかを検査する
     * @param {{ fieldname: string, originalname: string, encoding: string, mimetype: string, destination: string, filename: string, path: string. size: number }[]} FileInformations
     * @returns {boolean} 混ざっている場合はtrueを返す
     */
    containOtherThanAudio: FileInformations => FileInformations.some(f => !MimeTypeReg.test(f.mimetype)),
    /**
     * 投稿された全ファイルが正常に保存されているかを検査する
     * @param {{ fieldname: string, originalname: string, encoding: string, mimetype: string, destination: string, filename: string, path: string. size: number }[]} FileInformations
     * @returns {boolean}
     */
    containAnyFilesFailedToSave: FileInformations => FileInformations.some(f => !fs.existsSync(f.path)),
};
