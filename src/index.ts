export default {
	async fetch(request): Promise<Response> {
		const url = new URL(request.url);

		// Make sure path is convert.gif
		if (url.pathname === '/favicon.ico') return fetch('https://cdn.discordapp.com/emojis/1309618076446363650.gif?size=32');
		if (url.pathname !== '/convert.gif') return Response.redirect('https://github.com/UserPFP/static-gif');

		const fallback = `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 6)}.png`;

		// Only allow UserPFP avatar images
		const gif = url.searchParams.get('url');
		try {
			new URL(gif!);
		} catch {
			return fetch(fallback);
		}

		if (gif?.match(/https:\/\/raw\.githubusercontent\.com\/UserPFP\/img\/(refs\/heads\/)?main\/Avatars\//))
			return fetch(gif.replace('.gif', '.png'), request);
		else return fetch(fallback);

		//! Old logic
		// if (!gif?.startsWith("https://raw.githubusercontent.com/UserPFP/img/main/Avatars/")) return fetch(fallback);

		// let res: Response;
		// try {
		// 	// Fetch the gif and cache it accordingly
		// 	res = await fetch(gif, {
		// 		...request,
		// 		cf: {
		// 			cacheTtlByStatus: {
		// 				"200-299": 1500,
		// 				"404": 2700
		// 			}
		// 		}
		// 	});
		// } catch {
		// 	return fetch(fallback);
		// }

		// try {
		// 	const buffer = await res.arrayBuffer();

		// 	const parsed = parseGIF(buffer);
		// 	const aframe = parsed.frames.find(x => "image" in x);
		// 	if (!aframe) throw new Error("no aframe found");

		// 	const patch = decompressFrame(aframe, parsed.gct, true).patch;

		// 	const palette = quantize(patch, 256);
		// 	const index = applyPalette(patch, palette);

		// 	const frm = new GIFEncoder();
		// 	frm.writeFrame(index, aframe.image.descriptor.width, aframe.image.descriptor.height, {
		// 		palette,
		// 		transparent: true,
		// 		transparentIndex: aframe.gce.transparentColorIndex,
		// 	});
		// 	frm.finish();

		// 	const bytes = frm.bytes();
		// 	return new Response(bytes, {
		// 		headers: {
		// 			'Cache-Control': 'public, max-age=3600',
		// 			'Content-type': 'image/gif',
		// 			'Content-length': bytes.length.toString(),
		// 		},
		// 	});
		// } catch (e) {
		// 	try {
		// 		return new Response(res.bodyUsed ? res.clone().body : res.body, res);
		// 	} catch (f) {
		// 		return fetch(fallback);
		// 	}
		// }
	},
} satisfies ExportedHandler<Env>;
