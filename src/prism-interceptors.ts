import * as fs from "fs/promises";

export const f = async ({config, operation, mockedResponse}) => {
    // intercept here plz
    if (config.responseInterceptors) {
        try {
            const stat = await fs.stat(`${config.responseInterceptors}`);
            if (stat.isDirectory()) {
                const path = `${config.responseInterceptors}/${operation.iid}.js`;
                const interceptorFile = await fs.stat(path);
                if (interceptorFile.isFile()) {
                    const interceptor = await import(path);
                    try {
                        console.log('Using interceptor for operation ', operation.iid);
                        return interceptor.interceptor(mockedResponse);
                    } catch (e) {
                        console.error("error in interceptor", e);
                        return mockedResponse;
                    }
                }
            }
        } catch (e) {
            console.error(e);
            return mockedResponse;
        }
    }
}