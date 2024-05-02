// empty params
pub async fn moon_domain_resolver(params) {
    dbg("moon_domain_resolver fired");
    // QmcqikiVZJLmum6QRDH7kmLSUuvoPvNiDnCKY4A5nuRw17 - is html app hosted in IPFS
    return cid_result("QmcqikiVZJLmum6QRDH7kmLSUuvoPvNiDnCKY4A5nuRw17")
}

// params:
//      cid: CID of the content
//      contentType: text, image, video, pdf, etc...
//      content: content itself(text only supported for now)
pub async fn personal_processor(params) {
    let cid = params.cid;
    let content_type = params.contentType;
    let content = params.content;
    dbg(`personal_processor ${cid} ${content_type} ${content}`);
    if content_type != "text" {
        return pass()
    }

    if content.ends_with(".moon") {
        let items = content.split(".").collect::<Vec>();
        let username = items[0];
        let ext = items[1];
        if username.len() <= 14 && ext == "moon" {
            let passport = cyb::get_passport_by_nickname(username).await;
            let particle_cid = passport["extension"]["particle"];
            cyb::log(`Resolve ${username} domain from passport particle '${particle_cid}'`);
            let result = cyb::eval_script_from_ipfs(particle_cid, "moon_domain_resolver", #{}).await;
            dbg(result);
            return result
        }
    }

    let one_guy = "Mark Zukerberg";

    if content.contains(one_guy) {
        cyb::log(`Update ${cid} content, replace ${one_guy} to 'Elon Musk'`);
        return content_result(content.replace(one_guy, "Elon Musk"))
    }

    let buzz_word = "хуярта";

    if content.contains(buzz_word) {
        cyb::log(`Hide ${cid} item because of '${buzz_word}' in the content`);
        return hide()
    }

    // <ticker>@NOW btcusd@NOW
    if content.contains("@NOW") {
        let left_part = content.split("@NOW").next().unwrap();
        let symbol = left_part.split(" ").rev().next().unwrap();

        // external url call
        let json =  http::get( `https://api.binance.com/api/v3/ticker?symbol=${symbol}`).await?.json().await?;
        return content_result(content.replace(`${symbol}@NOW`, json["lastPrice"]))
    }

    if content.contains("openai@me") {
        // get path from url
        let path = cyb::context.params.path;
        if path.len() >= 2 && path[0] == "ipfs" {

            // get openAI api key from secrets
            let openAI_api_key = cyb::context.secrets.openAI_api_key;

            // get current item CID fro url cyb.ap/ipfs/Qm.....
            let cid = path[1];

            // get current item content from IPFS
            let main_text = cyb::get_text_from_ipfs(cid).await;
            // apply openAI prompt
            let result = cyb::open_ai_prompt(`${main_text}\r\n What is this text about?`, openAI_api_key).await;
            return content_result(`OpenAI say: ${result}`);
        }
    }

    pass() // Pass as is
}