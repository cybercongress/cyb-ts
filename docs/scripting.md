# Cyber Scripting

[Rune Language]: https://rune-rs.github.io

Cyb.ai uses [Rune Language] as embeddable scripting virtual machine.
Any user can tune-up and extend Cyber functionality by his own plugins/scripts.

# Script entry points

There is several points in the app where Rune scripts is embedded as part of workflow

## Particle post-processor

Every single particle goes thru pipeline and **personal_processor** function is applied to that:

```mermaid
graph LR
E(app) -- user input --> A[cyber] -- cid --> B[IPFS] -- content --> C(("personal_processor")) -- content mutation --> D(app)
```

```
// cid - Content id
// content_type - text, video, pdf, image
// content - at the moment ONLY TEXT content is availible here

pub async fn personal_processor(cid, content_type, content) {}
```

User can do any transformation/mutation of content in pipeline, and return next result using helper functions

```
// Update content
return update_content("Transformed content")

// Replace CID -> reapply new item
return update_cid("Qm.....")

// Hide item from App
return hide()

// Keep it as is
return pass()
```

## My Particle

Every user is able to create his own particle that appears in search results of all his followers:

```mermaid
graph LR
E(follower) -- search input --> C(("particle_inference")) -- answer --> D(search results)
```

```
// input - Search input

particle_inference(input) {}
```

Follower gets answer based on following particle automatically

```

// Answer with any cid/text content
return answer("blah")

// Ignore input
return skip()
```

## Bindings to interact with app

Cyber provide some bindings that extend Rune features with app/user specific features.

```
//Cyber
get_passport_by_nickname(nickname: string) -> json;

// OpenAI
open_ai_prompt(prompt: string; api_key: string);

// Cyberlinks
get_cyberlinks_from_cid(cid: string) -> json;
get_cyberlinks_to_cid(cid: string)  -> json;
cyber_search(query: string) -> json; //text | cid
cyber_link(from_cid: string, to_cid: string);

// IPFS
get_text_from_ipfs(cid: string) -> string;
add_text_to_ipfs(text: string);
```

## Context

Context of place where script is executed locaded in `cyb::context.app`

- params
  - path / query / search
- user
  - address / nickname / passport
- secrets
  - key/value storage

```
// Get list of url parameters
let path = cyb::context.app.params.path;

// Nickname of user that see this particle(in case of myParticle)
let nick = cyb::context.app.user.nickname;
```

## Secrets

User can manage secrets App sife and access to them from key-value object.

```
// Load value from secrets
let openAI_apiKey = cyb::context.app.secrets.openAI_apiKey;
```

## Helpers

```
// Add debug info to script output
dbg(`personal_processor ${cid} ${content_type} ${content}`);

// console.log
cyb:log("blah");
```

## Examples

### myParticle

```
pub async fn particle_inference(input) {
    let nickname =  cyb::context.app.user.nickname;
    return answer(`${nickname}, I want to buy your hears! Expensive.`);
    // Answer with IPFS content
    // return answer("QmYWfDTQKzQ52aJhbFedj4izvZKkvVRtFsJ9hyCup4EPKi");
}
```

### Particle post-processor

```

pub async fn personal_processor(cid, content_type, content) {

    dbg(`personal_processor ${cid} ${content_type} ${content}`);

    if content_type == "text" {

        // If parcicle content is like "<username>.moon"
        // Get particle's CID from <username> passport's extension
        // And show that content instead

        if content.contains(".") {
            let items = content.split(".").collect::<Vec>();
            let username = items[0];
            let ext = items[1];
            if username.len() <= 14 && ext == "moon" {
                let result = cyb::get_passport_by_nickname(username).await;
                let particle_cid = result["extension"]["particle"];

                cyb::log(`Change ${cid} to ${particle_cid} based on ${username} passport particle`);
                return update_cid(particle_cid)
            }
        }

        // Modify contennt
        if content.contains("dasein") {
            cyb::log(`Update ${cid} all the content with 'dasein' to 'Dasein the Great'`);
            return update_content(content.replace("dasein", "Dasein the Great"))
        }

        // Hide the content that I not want to see
        if content.contains("fuck") {
            cyb::log(`Hide items with fuck in ${cid}`);
            return hide()
        }

        // If in the content is something like TAG '<ticker>@NOW' for example 'BTCUSDT@NOW'
        // Fetch from external source that <ticker> price
        // and replace everywhere in the content
        if content.contains("@NOW") {
            let left_part = content.split("@NOW").next().unwrap();
            let symbol = left_part.split(" ").rev().next().unwrap();
            let json =  http::get( `https://api.binance.com/api/v3/ticker?symbol=${symbol}`).await?.json().await?;
            return update_content(content.replace(`${symbol}@NOW`, json["lastPrice"]))
        }

        // Place comment with TAG 'openai@me' to any particle
        // And let OpenAI process some prompt related to this particle
        if content.contains("openai@me") {
            let path =  cyb::context.app.params.path;
            if path.len() >= 2 && path[0] == "ipfs" {
                let open_ai_key = "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";
                let cid = path[1];
                cyb::log(`feed ${cid} content to openai`);
                let main_text = cyb::get_text_from_ipfs(cid).await;
                let result = cyb::open_ai_prompt(`${main_text}\r\n What is this text about?`, open_ai_key).await;
                return update_content(`OpenAI say: ${result}`);
            }
        }
    }

    pass() // Pass as is
}
```
