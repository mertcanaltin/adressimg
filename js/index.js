let ctx, img, qt;

//   renkler colorhunt.co/palette/120066
let color_pallete = [
	"#480032",
	"#df0054",
	"#ff8b6a",
	"#ffd2bb"
];

function QuadTree(x, y, w, h){
	if(w <= 1 || h <= 1) {
		return (
			0.2989*parseFloat(img.data[4*(y*ctx.canvas.width + x)]	) +
			0.5870*parseFloat(img.data[4*(y*ctx.canvas.width + x) + 1]	) +
			0.1140*parseFloat(img.data[4*(y*ctx.canvas.width + x) + 2]	)
		) >>> 6;
	}

	let mw = Math.round(w/2), mh = Math.round(h/2);

	let q = [
		QuadTree(x, y, mw, mh),
		QuadTree(x + mw, y, mw, mh),
		QuadTree(x, y + mh, mw, mh),
		QuadTree(x + mw, y + mh, mw, mh)
	];

	if(!(q[0] instanceof Array) && q[0] == q[1] && q[1] == q[2] && q[2] == q[3]) {
		return q[0];
	} else {
		return q;
	}
}

let history = [], i = [];

function animate(){
	if(i > history.length) return;

	let l = history[i];

	for(j = 0; j < 200 && i+j < history.length; j++) {
		l = history[i+j];
		ctx.fillStyle = color_pallete[l[4]];
		ctx.fillRect(l[0], l[1], l[2], l[3]);
		ctx.strokeRect(l[0], l[1], l[2], l[3]);
	}

	i+=j;
	requestAnimationFrame(animate);
}

function drawQT(x, y, w, h, q){
	if(!(q instanceof Array)){
		history.push([x, y, w, h, q]);
	} else {
		let mw = Math.round(w/2), mh = Math.round(h/2);

		drawQT(x, y, mw, mh, q[0]);
		drawQT(x + mw, y, mw, mh, q[1]);
		drawQT(x, y + mh, mw, mh, q[2]);
		drawQT(x + mw, y + mh, mw, mh, q[3]);
	}
}

function setup(argument) {
	let canvas = document.querySelector('canvas');
	let imgURL = document.querySelector('input');
	canvas.height = 512;
	canvas.width = 512;
	ctx = canvas.getContext('2d');

	imgHTML = new Image();
	imgHTML.crossOrigin = "Anonymous";

	imgHTML.onload = function(){
		canvas.width = imgHTML.naturalWidth/imgHTML.naturalHeight*512;

		ctx.strokeStyle = "rgba(0,0,0,0.1)";
		ctx.drawImage(imgHTML, 0, 0, canvas.width, canvas.height);
		img = ctx.getImageData(0, 0, canvas.width, canvas.height);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		generateQuadTree();
	}

	imgHTML.src = 'https://pbs.twimg.com/profile_images/991580825669001221/lrh-vUg7_400x400.jpg';
	imgURL.onchange = function(){
		imgHTML.src = imgURL.value;
	}

}

function generateQuadTree(){
	qt = QuadTree(0, 0, ctx.canvas.width, ctx.canvas.height);
	history = [];
	i = 0;

	drawQT(0, 0, ctx.canvas.width, ctx.canvas.height, qt);

	requestAnimationFrame(animate);
}

window.onload = setup;
