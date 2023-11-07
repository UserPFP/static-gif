import { decompressFrame, parseGIF } from 'gifuct-js';
//@ts-ignore blehh :P
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname !== '/convert.gif') return Response.redirect('https://github.com/UserPFP/static-gif');

		const fallback = `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 6)}.png`;

		let gif = url.searchParams.get('url');
		if (!gif) return fetch(fallback);

		try {
			// NOTE - Hotfix for the UserPFP vendetta plugin being silly
			const gifUrl = new URL(gif);
			if (gifUrl.hostname === 'static-gif.nexpid.workers.dev') {
				gif = gifUrl.searchParams.get('url');
				if (gif) new URL(gif);
				else throw ':P';
			}
		} catch {
			return fetch(fallback);
		}

		let res: Response;
		try {
			res = await fetch(gif, request);
		} catch {
			return fetch(fallback);
		}

		try {
			const buffer = await res.arrayBuffer();

			const parsed = parseGIF(buffer);
			const aframe = parsed.frames.find((x) => 'image' in x);
			if (!aframe || !('image' in aframe)) throw new Error('no aframe found');

			const patch = decompressFrame(aframe, parsed.gct, true).patch;

			const palette = quantize(patch, 256);
			const index = applyPalette(patch, palette);

			const frm = new GIFEncoder();
			frm.writeFrame(index, aframe.image.descriptor.width, aframe.image.descriptor.height, {
				palette,
				transparent: true,
				transparentIndex: aframe.gce.transparentColorIndex,
			});
			frm.finish();

			const bytes = frm.bytes();
			return new Response(bytes, {
				headers: {
					'Cache-Control': 'public, max-age=86400',
					'Content-type': 'image/gif',
					'Content-length': bytes.length.toString(),
				},
			});
		} catch (e) {
			try {
				return new Response(res.bodyUsed ? res.clone().body : res.body, res);
			} catch (f) {
				return fetch(fallback);
			}
		}
	},
};
