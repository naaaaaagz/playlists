$ErrorActionPreference = 'Stop'

$coverDirectory = Join-Path $PSScriptRoot 'covers'
New-Item -ItemType Directory -Path $coverDirectory -Force | Out-Null

$covers = @(
    @{ File = '00-all.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cddeac11b791c6c3eb4cbde5d' }
    @{ File = '01-im-the-protagonist.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c95442677845c20003cf666b2' }
    @{ File = '02-just-vibin.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72ca9209b4947d5c9f69a262c2d' }
    @{ File = '03-dont-wanna-move-or-do-anything.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c1437d7df03fd5f7f96794fcb' }
    @{ File = '04-im-very-rich-and-im-driving.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c99ffbb6e932f580ef9f8da1e' }
    @{ File = '05-i-just-wanna-bop-my-head.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c43a2dee339ed5db9d5aebcd6' }
    @{ File = '06-i-am-the-dormant-energy.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c3fe579f34d936179d8a016af' }
    @{ File = '07-keep-the-funk-alive.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cd74216289edcbcd1d6ae1bb1' }
    @{ File = '08-make-some-love-but-soulfully.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c8151db53b7bab21f55f8ba1f' }
    @{ File = '09-urban-love.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c4a5fb0b90300f2171f4c20df' }
    @{ File = '10-make-heatwaves-enjoyable.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72ce89efc3722dce4b61b15816d' }
    @{ File = '11-durban-rooftop-party.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c75a1d8c0e0e4695869027a61' }
    @{ File = '12-jah-not-for-the-thick-blooded.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c1f47e4d137278feb809c2cf4' }
    @{ File = '13-roots-man.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c8df76793befe8a6f89ac6c9b' }
    @{ File = '14-i-like-everything-thats-on-tv.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c29f94dc45529e8fa13adf266' }
    @{ File = '15-your-youtube-intro.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c614162d19e54fcfd28261f90' }
    @{ File = '16-baseball-caps-and-divas.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ced28fe8c3ff3395124caa8ac' }
    @{ File = '17-msn-ipods-and-myspace.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c4ad5f635bfc57fc5759dd71c' }
    @{ File = '18-fanny-packs-n64s-and-ripped-jeans.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cbb14c3016c32dd9dbd24fb2f' }
    @{ File = '19-sing-into-a-hairbrush.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c6621825e8148ff47bf18d71c' }
    @{ File = '20-black-nail-polish.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cef3f7fbc509ff7d645840978' }
    @{ File = '21-sadomazo-dungeon.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c71a6226e5ba02460ad2dbf8c' }
    @{ File = '22-glitter-distortion-and-autotune.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cd3f8dd0c62d1141f921628a8' }
    @{ File = '23-conscious-culture.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ce8a8464f3d2aec9a279966a5' }
    @{ File = '24-raise-the-roof-yo.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ce1e0982fcf2339a0c00553db' }
    @{ File = '25-let-them-cook.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72ca9446594bb8b82f031feb972' }
    @{ File = '26-melt-your-face-with-bass.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cbe4db957bf32859e904c97f7' }
    @{ File = '27-i-hate-to-break-it-to-ya.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c1a53dbca4d03820fb7bda579' }
    @{ File = '28-did-you-like-the-matrix.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cf47cd2c60961ae338dcdfcb5' }
    @{ File = '29-welcome-alien-overlords.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c18ed69ca723c3e1865cb64c2' }
    @{ File = '30-bruh-are-we-the-aliens.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c5f8fa59d8d212807c86716a8' }
    @{ File = '31-lets-cry-naked-on-the-subway.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72caf569cfebcf1eb09e267dc87' }
    @{ File = '32-2006-london-and-youre-stoned.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c59c856ac58bc3eb0d8f82632' }
    @{ File = '33-gaze-into-the-lights-and-think.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cee26fe10f3bfd1ee052abcee' }
    @{ File = '34-seatbelt-substitute.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c3a15e2e79a6c9304211444ed' }
    @{ File = '35-breakups-suck.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cb7a1ae24c49f27cd7ae94f00' }
    @{ File = '36-crystals-facebook-and-menopause.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c85add229a9df37c28d3f3029' }
    @{ File = '37-audible-melatonin.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c0ee3aa2ff9461f4c022d722d' }
    @{ File = '38-rock-on-everybody.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ccfe6013082fbd390c679e66b' }
    @{ File = '39-id-marry-my-harley.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c17c4b1d19b037eab00f6580f' }
    @{ File = '40-got-some-spare-change.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c9cfe8ecb766d74411348bf4b' }
    @{ File = '41-dude-that-festival-was-bonkers.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c845315b1e9d6b1f10b483cdf' }
    @{ File = '42-for-hipster-coffee-shop-owners.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c8801bd4e16984c693bc84e1f' }
    @{ File = '43-wear-flowers-in-your-hair.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c99b189b524a1d4b275fd9bd1' }
    @{ File = '44-help-my-grandma-took-over-spotify.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c2782ccf33c7c0014824f62c7' }
    @{ File = '45-shakas-and-wipeout.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c84e31617ae951729de272b46' }
    @{ File = '46-nerds-with-guitars.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c768325b7fd60c66eb2120316' }
    @{ File = '47-wow-i-got-nice-shoes.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cc5769096680b8f5b46f8a24a' }
    @{ File = '48-mwuaaarrrrggh.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ca211905722fb335e86198d40' }
    @{ File = '49-ride-the-dragon-aummmmm.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cff83f80f6bb45be1e169949b' }
    @{ File = '50-melt-away-into-the-universe.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cd19ed4f83dd6421d6f100ede' }
    @{ File = '51-the-house-party-is-about-to-start.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c00c54e6abb98b8afcb67310f' }
    @{ File = '52-oh-my-techno-goodness.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c113961b5bfba40dfef9648b2' }
    @{ File = '53-submerged-in-4-4.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cdce62ad7b831975c83e4d5eb' }
    @{ File = '54-come-down-at-the-afterparty.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c164f05da7dec88b21799afd2' }
    @{ File = '55-ex-and-estrogen.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cadf56c587e792e3ec49c3570' }
    @{ File = '56-bald-head-and-hakkuh.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c66a5b1103e9d656e0089a0a8' }
    @{ File = '57-good-morning-neighbors.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c04b88c9d9112618ee606bcec' }
    @{ File = '58-gameboys-and-synthesizers.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c1df6e22416c0b3847eb2bdb8' }
    @{ File = '59-i-understand-quantum-physics.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c2d1d352154eb33dcf25e07fb' }
    @{ File = '60-honor-thy-folk-heritage.jpg'; Url = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c0c8a7cd3812543f066af5c46' }
    @{ File = '61-saxophone-a-z-z.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c2227dfdb7a2bb4d38d3eff4b' }
    @{ File = '62-dead-guys-in-wigs.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c08146ef5628b27c9d03f6ff4' }
    @{ File = '63-hey-kids-do-you-like-music.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c3e0005c477b19a5a9a148c4d' }
    @{ File = '64-lol-why-does-this-exist.jpg'; Url = 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72cbc1d8464a1c67d636cdab87c' }
)

foreach ($cover in $covers) {
    $targetPath = Join-Path $coverDirectory $cover.File
    curl.exe --fail --location --silent --show-error $cover.Url --output $targetPath
}

$covers | ForEach-Object {
    [pscustomobject]@{
        File = $_.File
        SourceUrl = $_.Url
    }
} | Export-Csv -LiteralPath (Join-Path $coverDirectory 'manifest.csv') -NoTypeInformation -Encoding utf8

