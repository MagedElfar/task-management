import * as fs from "fs";

export default class Media {
    static deleteSingleMedia(path: string) {
        return new Promise((resolve: any, reject: any) => {
            fs.unlink(path, function (error: any) {
                if (error) {
                    console.log(error)
                    reject(error);
                    return;
                }

                resolve()
            });
        })
    }
}