import { decompressFrame, parseGIF } from 'gifuct-js';
//@ts-ignore blehh :P
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname !== '/convert.gif') return Response.redirect('https://github.com/UserPFP/static-gif');

		const gif = url.searchParams.get('url');
		if (!gif) return Response.json({ error: 'missing url query' }, { status: 400 });

		try {
			new URL(gif);
		} catch {
			return Response.json({ error: 'url query is not a valid URL' }, { status: 400 });
		}

		let res: Response;
		try {
			res = await fetch(gif, request);
		} catch {
			return Response.json({ error: 'an error occured while converting' }, { status: 400 });
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
			frm.writeFrame(index, aframe.image.descriptor.width, aframe.image.descriptor.height, { palette, transparent: true });
			frm.finish();

			const bytes = frm.bytes();
			return new Response(bytes, {
				headers: {
					'Cache-Control': 'public, max-age=86400',
					'Content-type': 'image/gif',
					'Content-length': bytes.length.toString(),
				},
			});
		} catch {
			return new Response(res.body, res);
		}
	},
};
