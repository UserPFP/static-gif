# ![static-gif](./.github/banger.gif)

> [!IMPORTANT]
> This worker is no longer needed, as (almost) every image stored in the [img](https://github.com/UserPFP/img) repo is saved as both .gif and .png

A shrimple [Cloudflare Worker](https://workers.cloudflare.com/) that turns animated UserPFP avatars into static ones. (formerly) Used by [the Bunny plugin](https://bunny.nexpid.xyz/userpfp)

## Examples

| Original                                                                                                        | Static                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![spinning chip](https://raw.githubusercontent.com/UserPFP/img/main/Avatars/9/905278377508884552.gif)           | ![spinning chip but it's not spinning](https://static-gif.nexpid.workers.dev/convert.gif?url=https://raw.githubusercontent.com/UserPFP/img/main/Avatars/9/905278377508884552.gif)        |
| ![absolutely fuming kitty](https://raw.githubusercontent.com/UserPFP/img/main/Avatars/9/916041347855712307.gif) | ![absolutely fuming kitty but frozen in time](https://static-gif.nexpid.workers.dev/convert.gif?url=https://raw.githubusercontent.com/UserPFP/img/main/Avatars/9/916041347855712307.gif) |
