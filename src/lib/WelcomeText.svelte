<div class="centered">
	<div class="lines" />
	<div class="lazer84">AR Audio</div>
</div>

<svg>
	<defs>
		<circle id="circle" cx="50%" cy="50%" r="20%" fill="#ce00df" />
		<filter id="fakeHalftone" width="150%" height="150%">
			<feImage x="0" y="0" width="2%" height="4%" xlink:href="#circle" result="circle" />
			<feTile result="pattern" />
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.05"
				numOctaves="1"
				seed="1"
				stitchTiles="stitch"
				result="noise"
			/>
			<feColorMatrix in="noise" type="saturate" values="0" result="desaturatedNoise" />
			<feComponentTransfer in="desaturatedNoise" result="mask">
				<feFuncA type="discrete" tableValues="0 1" />
			</feComponentTransfer>

			<feComposite in="pattern" in2="mask" operator="in" out="pattern1" />

			<feComposite in2="SourceGraphic" in="pattern1" operator="in" />
			<feOffset dx="5" result="halftone1" />

			<feOffset dx="-2" dy="3" result="halftone2" />
			<feFlood flood-color="#6b0547" result="color" />
			<feComposite in="color" in2="halftone2" operator="in" result="halftone2" />

			<feMerge result="halftone">
				<feMergeNode in="SourceGraphic" />
				<feMergeNode in="halftone2" />
				<feMergeNode in="halftone1" />
			</feMerge>

			<!-- first bevel -->
			<feMorphology operator="dilate" radius="2" in="SourceAlpha" result="BEVEL_10" />
			<feConvolveMatrix
				order="3,3"
				kernelMatrix="1 0 0 
   0 1 0
   0 0 1"
				in="BEVEL_10"
				result="BEVEL_20"
			/>
			<feOffset dx="0" dy="0" in="BEVEL_20" result="BEVEL_30" />
			<feComposite operator="in" in="BEVEL_20" result="BEVEL_30" />
			<feOffset dx="3" dy="3" in="BEVEL_20" result="BEVEL_30" />
			<feOffset dx="5" dy="5" in="BEVEL_20" result="BEVEL_40" />
			<feOffset dx="10" dy="10" in="BEVEL_20" result="BEVEL_50" />
			<feFlood flood-color="#060469" result="color1" />
			<feFlood flood-color="#36a39d" result="color2" />
			<feFlood flood-color="#4200ff" result="color3" />
			<feComposite in2="BEVEL_30" in="color1" operator="in" result="bevel1" />
			<feComposite in2="BEVEL_40" in="color2" operator="in" result="bevel2" />
			<feComposite in2="BEVEL_50" in="color3" operator="in" result="bevel3" />
			<feGaussianBlur stdDeviation="13 0" result="blurryEdge" />
			<feMerge>
				<feMergeNode in="blurryEdge" />
				<feMergeNode in="bevel3" />
				<feMergeNode in="bevel2" />
				<feMergeNode in="bevel1" />

				<feMergeNode in="halftone" />
			</feMerge>
		</filter>

		<filter id="sideBlur" width="200%">
			<feGaussianBlur in="SourceGraphic" stdDeviation="20 0" result="blurryEdge" />
		</filter>

		<filter id="noise" x="0vw" y="0vh" width="100vw" height="100vh">
			<feFlood flood-color="#808080" result="neutral-gray" />
			<feTurbulence
				in="neutral-gray"
				type="fractalNoise"
				baseFrequency="0.8"
				numOctaves="10"
				stitchTiles="stitch"
				result="noise"
			/>
			<feColorMatrix in="noise" type="saturate" values="0" result="destaturatedNoise" />
			<feComponentTransfer in="desaturatedNoise" result="theNoise">
				<feFuncA type="table" tableValues="0 0 0.2 0" />
			</feComponentTransfer>
			<feBlend in="SourceGraphic" in2="theNoise" mode="soft-light" result="noisy-image" />
		</filter>
	</defs>
</svg>

<style>
	:root {
		background: black;
		filter: url(#noise) contrast(120%);
	}

	:root::before {
		content: ' ';
		position: absolute;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		opacity: 0.3;
		background-position-y: 0px;
		background-image: repeating-linear-gradient(
				90deg,
				#504a64 0%,
				transparent 1px,
				transparent 50px,
				#504a64 50px
			),
			repeating-linear-gradient(180deg, #504a64 0%, transparent 1px, transparent 50px, #504a64 50px);
	}

	.centered {
		position: absolute;
		left: 50vw;
		top: 50vh;
		transform: translateX(-50%) translateY(-50%) rotate(-5deg);
		text-align: center;
	}

	.lazer84 {
		font-family: 'Lazer84';
		font-size: 40vh;
		letter-spacing: 0.2em;
		max-width: 3em;
		color: #b70077;
		filter: url(#fakeHalftone);
		line-height: 0.9em;
	}
	.lazer84:first-letter {
		font-size: 1.5em;
	}
	.lines {
		/*   background-color:red; */
		position: absolute;
		width: 90%;
		height: 50%;
		left: 10%;
		top: 30%;
		padding: 0 2em;
		background-image: repeating-linear-gradient(
			180deg,
			#2a65fd 0%,
			transparent 10%,
			transparent 12%,
			#12018e 12%
		);

		filter: url(#sideBlur);
	}
</style>
