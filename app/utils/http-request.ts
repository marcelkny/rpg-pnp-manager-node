import https from "https";
import http from "http";
import { URL } from "url";

export async function sensorPushPostJSON(requestUrl: string, authHeader: string, body?: any): Promise<any> {
    const res = await sensorPushPost(requestUrl, authHeader, JSON.stringify(body));
    return JSON.parse(res);
}

export async function sensorPushPost(requestUrl: string, authHeader: string, bodyData?: string): Promise<string> {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (authHeader.length > 0) {
        (options.headers as Record<string, string>)["Authorization"] = authHeader;
    }
    return httpRequest(requestUrl, options, bodyData ?? "{}");
}

export async function httpRequest(url: string | URL, options: https.RequestOptions, bodyData: string = ""): Promise<string> {
    return new Promise(function (resolve, reject) {
        const req = https
            .request(typeof url === "string" ? url : url.toString(), options, (res) => {
                let data = "";

                // console.log("Status Code:", res.statusCode);
                // console.log(new Date());

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    console.log(data);
                    resolve(data);
                });
            })
            .on("error", (err) => {
                console.log("Error: ", err.message);
                reject(err);
            });

        if (bodyData.length > 0) {
            req.write(bodyData);
        }

        req.end();
    });
}

export interface APIResponse {
    name: string;
    status?: number;
    message: JSON | string;
}
export function getAPIStatus(options: http.RequestOptions, api: string) {
    return new Promise<APIResponse>(function (resolve) {
        let http_get;
        let opts;
        if (options.port == 443) {
            http_get = https.get;
            opts = options as https.RequestOptions;
        } else {
            http_get = http.get;
            opts = options;
        }
        const req = http_get(opts, function (res) {
            // console.log("STATUS: " + res.statusCode);
            // console.log("HEADERS: " + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            const bodyChunks: any[] = [];
            res.on("data", function (chunk) {
                // You can process streamed parts here...
                // console.log("chunk", chunk);

                bodyChunks.push(chunk);
            }).on("end", function () {
                const body = Buffer.concat(bodyChunks);
                const message = JSON.parse(body.toString());
                const resolveInfo: APIResponse = { name: api, status: res.statusCode, message: message["msg"] };
                resolve(resolveInfo);
            });
        });
        req.on("timeout", function () {
            const timeoutMessage = "connection timeout";
            const resolveInfo: APIResponse = { name: api, status: 998, message: timeoutMessage };
            console.log("TIMEOUT!!!!");
            resolve(resolveInfo);
        });
        req.on("error", function (e) {
            // console.log("ERROR: " + e.message);
            const errorMessage = e.message;
            const resolveInfo: APIResponse = { name: api, status: 999, message: errorMessage };
            resolve(resolveInfo);
        });
        req.end();
    });
}

export interface JSONResponse {
    status: number;
    data: string;
}

export function postJSONRequest(options: http.RequestOptions, postData: string) {
    console.log("starting postJSONRequest");
    return new Promise<JSONResponse>(function (resolve, reject) {
        const addHeader = {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
        };
        options.headers = {
            ...(options.headers ? options.headers : {}),
            ...addHeader,
        };
        let http_post;
        let opts;
        if (options.port == 443) {
            http_post = https.request;
            opts = options as https.RequestOptions;
        } else {
            http_post = http.request;
            opts = options;
        }
        const req = http_post(opts, function (res) {
            // console.log("STATUS: " + res.statusCode);
            // console.log("HEADERS: " + JSON.stringify(res.headers));
            res.setEncoding("utf8");
            let body: string = "";
            res.on("data", function (chunk) {
                // You can process streamed parts here...
                // console.log("chunk", chunk);

                body += chunk;
            }).on("end", function () {
                resolve({ status: res.statusCode ?? 0, data: body.toString() });
            });
        });

        req.on("timeout", function () {
            reject(new Error("TIMEOUT Junge!"));
        });
        req.on("error", function (e) {
            console.log("ERRRRROOOOOOORRRRRRRR");
            reject(e);
        });
        req.write(postData);
        req.end();
    });
}
