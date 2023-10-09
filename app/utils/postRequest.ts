import * as http from "http";
import https from "https";

export async function postJSON(host: string, path: string, port: number, api_key: string, postDataString?: string) {
    const deviceApiOptions: http.RequestOptions = {
        host: host,
        path: path,
        port: port,
        timeout: 10000,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-APIKEY": api_key,
        },
    };
    const postData =
        postDataString ??
        JSON.stringify({
            id: "moin moin",
        });
    // Request DeviceRefList from Device API
    const result = await postJSONRequest(deviceApiOptions, postData);
    const jsonResult = JSON.parse(result.data)["msg"];
    // console.log("result: ", jsonResult);
    return jsonResult;
}
export interface JSONResponse {
    status: number;
    data: string;
}

async function postJSONRequest(options: http.RequestOptions, postData: string) {
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
            console.log("STATUS: " + res.statusCode);
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
