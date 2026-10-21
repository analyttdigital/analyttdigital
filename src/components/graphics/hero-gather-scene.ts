// @ts-nocheck
/* eslint-disable */
import * as THREE from "three";
import gsap from "gsap";

export function runHeroGather(
	heroEl: HTMLElement,
	canvasEl: HTMLCanvasElement,
	opts?: { getProgress?: () => number }
): (() => void) | undefined {
	"use strict";

	// Portal choreography helpers. `sstep` mirrors `smooth` in
	// src/lib/motion/smooth.ts (kept local so this scene stays a single
	// dependency-free module whose CONFIG remains live-editable from the
	// console). `getP` is the hero's scroll progress, read imperatively.
	function sstep(a, b, x) {
		var t = (x - a) / (b - a);
		t = t < 0 ? 0 : t > 1 ? 1 : t;
		return t * t * (3 - 2 * t);
	}
	var getP =
		(opts && opts.getProgress) ||
		function () {
			return 0;
		};
	// Scroll-driven scatter window (fractions of `p`) and depth: the gather
	// uniform rests at 1 (logo formed) and falls to 1 - SCATTER_DEPTH while
	// the portal beat runs, so the mark loosens toward its open cloud on the
	// way down and re-forms on the way back up. Keyed to PORTAL_RANGE
	// ([0.35, 0.6] in src/lib/motion/portal.ts): the scatter finishes just
	// before the flood circle starts opening, so the bloom grows out of a
	// loosened cloud. Depth stops at 0.35, not 0:
	// at 0 every icon's alpha hits zero and the cloud would vanish instead
	// of visibly scattering.
	var SCATTER_START = 0.22,
		SCATTER_END = 0.34,
		SCATTER_DEPTH = 0.65;

	// tile = [x, y, rotationDeg, scale, iconType, paletteIndex, alpha] in the 360x360 SVG space
	var TILES = [
		[112.2, -11.0, -7.6, 1.53, 6, 0, 0.82],
		[127.3, -15.3, -2.8, 1.7, 9, 0, 0.95],
		[86.9, 1.8, -5.2, 1.36, 12, 0, 1.0],
		[101.2, 2.1, 16.4, 1.5, 11, 3, 0.68],
		[124.9, 7.6, -10.1, 1.24, 5, 1, 0.89],
		[136.6, 5.0, 12.3, 1.67, 5, 3, 0.7],
		[75.7, 23.6, 0.6, 1.26, 1, 2, 0.61],
		[90.9, 25.3, 13.6, 1.13, 0, 0, 0.85],
		[115.2, 19.5, 11.5, 1.55, 8, 2, 0.59],
		[133.4, 22.6, -14.8, 1.51, 2, 0, 0.96],
		[52.1, 41.0, 11.2, 1.54, 12, 1, 0.98],
		[67.0, 42.7, 11.8, 1.59, 0, 1, 0.82],
		[82.1, 38.9, 12.1, 1.03, 10, 0, 0.93],
		[103.3, 38.0, -1.5, 1.16, 8, 0, 0.95],
		[124.2, 36.7, 8.8, 1.37, 1, 3, 0.56],
		[38.4, 58.5, -12.0, 1.27, 8, 1, 0.82],
		[61.2, 58.0, 14.6, 1.13, 8, 3, 0.59],
		[73.5, 54.7, -14.7, 1.22, 12, 1, 0.87],
		[94.6, 61.1, -3.1, 1.55, 3, 3, 0.66],
		[111.0, 56.7, -8.0, 1.0, 8, 2, 0.53],
		[130.2, 60.3, -14.7, 1.63, 10, 1, 0.88],
		[147.6, 61.6, 13.4, 1.63, 6, 0, 0.83],
		[167.7, 61.2, 3.1, 1.33, 8, 0, 0.81],
		[186.8, 61.8, -14.1, 1.15, 10, 1, 0.83],
		[198.9, 60.6, 12.5, 1.51, 12, 3, 0.52],
		[216.3, 60.3, 15.1, 1.14, 10, 2, 0.71],
		[236.0, 59.1, -14.0, 1.51, 9, 0, 0.86],
		[253.5, 56.1, -18.0, 1.58, 4, 2, 0.72],
		[277.7, 59.2, -0.9, 1.66, 0, 1, 0.91],
		[34.1, 77.9, 15.5, 1.75, 10, 2, 0.54],
		[52.5, 78.0, 5.9, 0.98, 5, 3, 0.68],
		[66.5, 72.9, -15.1, 1.01, 1, 3, 0.71],
		[85.5, 78.1, 9.7, 1.25, 6, 2, 0.68],
		[99.7, 77.6, 1.5, 1.11, 5, 3, 0.54],
		[122.9, 75.8, -9.1, 1.46, 0, 3, 0.51],
		[138.7, 78.4, -11.0, 1.0, 5, 0, 0.98],
		[155.9, 74.7, -16.4, 1.71, 4, 2, 0.7],
		[171.0, 78.0, 4.8, 1.68, 3, 0, 0.8],
		[189.9, 77.7, 9.9, 1.32, 7, 2, 0.7],
		[208.1, 76.0, 15.5, 0.96, 12, 2, 0.68],
		[226.2, 73.9, -1.4, 1.64, 6, 0, 0.9],
		[249.0, 74.0, -16.8, 1.0, 6, 2, 0.54],
		[268.1, 79.9, -15.0, 1.16, 11, 0, 0.88],
		[286.8, 73.4, -1.4, 1.06, 12, 1, 0.95],
		[302.3, 73.0, -7.4, 1.62, 11, 2, 0.58],
		[18.3, 95.9, 11.3, 1.68, 5, 2, 0.59],
		[37.5, 92.5, 10.6, 1.11, 1, 3, 0.51],
		[60.4, 95.3, 1.2, 1.07, 4, 1, 0.88],
		[75.3, 92.3, 16.3, 1.2, 5, 2, 0.66],
		[93.3, 90.1, 10.9, 1.56, 6, 1, 0.88],
		[109.6, 90.0, -2.7, 1.67, 5, 0, 0.88],
		[129.7, 91.3, 1.9, 0.96, 9, 3, 0.52],
		[151.4, 95.9, -5.5, 1.09, 1, 1, 0.9],
		[162.9, 93.9, 16.8, 1.59, 0, 1, 0.86],
		[187.8, 93.9, 15.3, 0.99, 11, 3, 0.52],
		[203.0, 96.6, 10.3, 1.08, 9, 1, 0.92],
		[222.8, 96.6, -10.1, 1.1, 2, 3, 0.71],
		[237.1, 91.0, 8.1, 1.15, 8, 1, 0.81],
		[258.7, 95.4, -6.3, 1.48, 8, 3, 0.63],
		[276.8, 96.2, -6.9, 1.47, 10, 1, 0.89],
		[290.9, 94.0, -17.9, 1.09, 7, 3, 0.6],
		[312.1, 96.2, -11.5, 1.32, 1, 3, 0.59],
		[-6.7, 114.5, 6.7, 1.59, 5, 1, 0.81],
		[13.9, 110.0, 4.1, 1.21, 8, 3, 0.53],
		[34.7, 111.8, 4.2, 1.42, 0, 1, 0.86],
		[46.6, 111.2, -8.0, 1.46, 2, 2, 0.7],
		[69.3, 110.1, -16.3, 1.56, 7, 2, 0.71],
		[85.4, 112.6, -14.2, 1.66, 5, 3, 0.66],
		[101.1, 115.9, -5.0, 1.41, 2, 0, 0.89],
		[121.9, 115.7, 0.6, 1.19, 9, 2, 0.64],
		[142.4, 115.2, 8.9, 1.54, 9, 1, 0.83],
		[158.0, 111.3, -16.3, 1.24, 10, 3, 0.55],
		[171.4, 108.4, -7.1, 1.4, 6, 2, 0.62],
		[193.7, 112.7, 4.5, 1.11, 0, 3, 0.53],
		[214.5, 109.9, -14.6, 1.07, 12, 1, 0.97],
		[227.2, 114.5, -16.0, 1.72, 9, 2, 0.63],
		[246.6, 115.5, -9.1, 1.54, 8, 0, 0.81],
		[261.2, 109.5, 14.8, 1.08, 8, 0, 0.8],
		[284.3, 109.6, 0.7, 1.28, 2, 3, 0.68],
		[301.1, 108.5, 17.8, 1.45, 0, 3, 0.66],
		[318.0, 111.5, -15.1, 1.68, 1, 3, 0.54],
		[-10.7, 127.5, 3.6, 1.26, 10, 3, 0.7],
		[7.4, 133.9, 1.3, 1.62, 11, 3, 0.68],
		[18.1, 126.2, -9.6, 1.71, 6, 2, 0.67],
		[41.0, 126.6, -12.8, 1.68, 9, 0, 0.82],
		[61.4, 128.8, -17.0, 1.06, 10, 0, 0.83],
		[77.1, 131.6, -15.6, 1.54, 8, 2, 0.54],
		[97.1, 126.5, 14.9, 1.64, 3, 3, 0.52],
		[109.6, 126.3, 14.8, 1.71, 10, 0, 0.97],
		[131.1, 129.8, 10.5, 1.06, 5, 1, 0.86],
		[147.4, 126.2, -7.8, 1.16, 12, 2, 0.7],
		[169.7, 130.0, 4.3, 1.63, 0, 0, 0.96],
		[183.5, 132.2, 7.4, 1.23, 1, 1, 0.94],
		[202.6, 128.3, 0.8, 1.3, 0, 2, 0.67],
		[216.0, 129.9, 10.7, 1.34, 9, 1, 0.99],
		[236.8, 132.7, 16.0, 1.16, 11, 2, 0.68],
		[253.9, 127.3, 9.6, 1.7, 11, 3, 0.67],
		[274.5, 126.8, -14.6, 1.21, 11, 3, 0.7],
		[288.7, 133.1, -10.6, 0.97, 8, 2, 0.59],
		[310.0, 129.0, -9.6, 1.66, 9, 3, 0.53],
		[330.0, 132.0, -5.5, 1.47, 7, 2, 0.61],
		[-2.4, 148.9, 17.1, 1.53, 5, 2, 0.63],
		[10.3, 146.6, 17.1, 1.1, 10, 0, 0.83],
		[27.8, 147.1, 10.6, 1.74, 3, 2, 0.6],
		[45.9, 151.3, 13.9, 1.17, 6, 3, 0.51],
		[69.8, 147.5, 17.3, 1.13, 2, 2, 0.6],
		[83.1, 149.9, -9.3, 0.95, 9, 3, 0.65],
		[105.0, 147.4, 8.0, 1.13, 10, 1, 0.94],
		[118.0, 147.5, 7.2, 1.16, 6, 3, 0.55],
		[140.7, 149.0, -2.8, 1.15, 6, 3, 0.5],
		[157.1, 149.3, 14.2, 1.65, 6, 2, 0.67],
		[177.7, 151.3, -9.0, 1.04, 12, 1, 0.83],
		[196.6, 145.6, 12.5, 1.23, 11, 3, 0.62],
		[210.8, 144.1, -4.7, 1.58, 7, 2, 0.59],
		[226.7, 149.5, 9.5, 1.26, 9, 0, 0.95],
		[245.8, 144.5, -3.6, 1.17, 6, 0, 0.82],
		[266.0, 149.4, -14.1, 1.41, 8, 2, 0.66],
		[286.8, 152.0, -1.4, 1.72, 12, 1, 0.83],
		[297.6, 150.4, 5.1, 1.1, 2, 1, 0.96],
		[317.8, 149.1, 11.4, 1.6, 12, 3, 0.72],
		[42.3, 163.3, 3.9, 1.66, 8, 0, 0.93],
		[60.3, 168.7, 6.9, 1.11, 7, 0, 0.95],
		[77.4, 162.9, -2.9, 1.04, 8, 1, 0.89],
		[90.5, 165.7, -0.3, 1.07, 9, 3, 0.54],
		[114.9, 162.1, -1.2, 1.62, 7, 3, 0.65],
		[129.0, 165.4, -15.3, 1.72, 0, 2, 0.64],
		[223.9, 169.0, -10.7, 1.23, 5, 3, 0.67],
		[235.5, 167.7, 17.0, 1.05, 0, 0, 0.96],
		[255.2, 166.4, 2.7, 1.27, 0, 3, 0.57],
		[270.4, 168.6, 9.6, 1.33, 8, 0, 0.96],
		[292.9, 166.9, 7.1, 1.45, 10, 0, 0.84],
		[311.1, 167.0, 5.9, 1.09, 1, 0, 0.88],
		[331.3, 167.2, 11.6, 1.25, 4, 2, 0.62],
		[32.5, 181.0, -14.8, 1.72, 0, 0, 0.83],
		[47.2, 184.6, 8.8, 1.31, 11, 0, 0.87],
		[68.7, 186.8, -15.0, 1.53, 4, 3, 0.6],
		[88.3, 180.4, -15.8, 0.98, 4, 0, 0.88],
		[104.8, 181.3, -0.5, 1.64, 9, 0, 0.86],
		[122.8, 183.8, 16.8, 1.08, 10, 0, 0.87],
		[136.3, 186.4, 10.0, 1.33, 12, 3, 0.71],
		[231.5, 186.9, -8.1, 1.41, 1, 3, 0.58],
		[247.3, 183.9, 10.4, 1.26, 0, 1, 0.86],
		[266.4, 183.7, -8.8, 1.12, 7, 0, 0.96],
		[283.3, 184.3, -15.7, 1.23, 4, 3, 0.63],
		[304.1, 184.2, 3.2, 1.33, 1, 1, 0.84],
		[316.4, 185.6, 2.3, 1.24, 2, 3, 0.67],
		[43.7, 200.1, 5.1, 1.4, 2, 3, 0.54],
		[57.0, 199.9, -11.8, 1.53, 0, 2, 0.71],
		[79.2, 205.2, -16.3, 1.62, 2, 3, 0.51],
		[92.5, 198.0, 8.9, 1.11, 1, 3, 0.67],
		[111.8, 201.0, -4.5, 1.26, 3, 3, 0.54],
		[132.5, 205.3, -1.2, 1.66, 2, 1, 0.96],
		[151.4, 199.8, 13.2, 1.7, 1, 1, 0.96],
		[241.2, 198.9, -16.0, 1.73, 4, 1, 0.91],
		[253.0, 204.0, -2.4, 1.73, 3, 2, 0.72],
		[270.8, 200.3, -15.9, 1.67, 10, 2, 0.53],
		[288.1, 204.5, -13.0, 1.22, 8, 0, 0.96],
		[308.3, 200.9, -3.3, 0.98, 2, 2, 0.63],
		[330.7, 202.2, -11.7, 1.13, 9, 0, 0.97],
		[46.0, 221.7, 13.2, 1.6, 6, 2, 0.67],
		[67.6, 223.2, -14.1, 1.18, 0, 3, 0.6],
		[85.2, 220.3, 16.8, 0.97, 2, 1, 0.92],
		[99.8, 218.0, -16.9, 1.6, 11, 0, 0.99],
		[118.6, 216.1, 2.8, 1.43, 1, 1, 0.94],
		[137.8, 216.8, -8.2, 1.09, 8, 3, 0.61],
		[159.1, 216.9, 13.8, 1.05, 2, 1, 0.97],
		[176.4, 219.7, 16.1, 1.27, 6, 0, 0.99],
		[194.6, 220.8, -16.7, 1.43, 5, 0, 0.96],
		[210.2, 222.7, 12.3, 1.52, 8, 2, 0.68],
		[225.4, 220.1, 15.6, 1.72, 10, 1, 0.97],
		[248.1, 218.9, -15.5, 1.37, 10, 3, 0.54],
		[261.2, 217.1, 10.0, 1.73, 12, 3, 0.64],
		[286.8, 223.8, 13.2, 0.98, 9, 2, 0.7],
		[299.2, 220.3, 4.4, 1.69, 0, 2, 0.53],
		[318.5, 223.6, -7.0, 1.18, 9, 1, 0.82],
		[340.7, 223.4, -15.0, 1.67, 8, 1, 0.89],
		[352.1, 218.3, -7.6, 1.28, 11, 1, 0.95],
		[373.4, 222.7, 2.5, 1.44, 11, 3, 0.54],
		[38.4, 240.2, -15.6, 1.08, 0, 2, 0.6],
		[58.1, 240.7, 9.5, 1.23, 10, 1, 1.0],
		[77.9, 235.2, -5.3, 1.22, 4, 1, 0.92],
		[96.6, 238.1, 8.8, 1.54, 10, 3, 0.56],
		[113.7, 241.3, 13.3, 1.05, 8, 0, 0.88],
		[130.7, 238.0, 2.6, 1.72, 4, 3, 0.69],
		[151.0, 238.9, -1.7, 1.25, 5, 3, 0.56],
		[164.3, 237.1, -4.2, 1.39, 11, 2, 0.5],
		[186.8, 238.0, -11.4, 1.31, 6, 2, 0.68],
		[202.6, 238.7, 15.1, 1.02, 9, 2, 0.71],
		[222.7, 241.7, -2.6, 1.11, 4, 0, 0.81],
		[238.5, 238.0, 9.8, 1.69, 8, 3, 0.61],
		[257.8, 237.4, -16.5, 1.32, 0, 2, 0.6],
		[275.4, 238.2, -4.5, 1.03, 9, 3, 0.64],
		[289.2, 235.5, -3.5, 1.29, 11, 2, 0.65],
		[312.5, 235.4, 17.2, 1.2, 1, 2, 0.61],
		[329.2, 236.4, 15.7, 1.22, 8, 3, 0.64],
		[344.3, 238.1, -11.2, 1.35, 9, 1, 0.81],
		[364.8, 236.8, 4.9, 1.74, 0, 0, 0.94],
		[49.1, 252.2, 16.1, 1.01, 9, 3, 0.68],
		[66.4, 258.4, 6.6, 1.47, 3, 2, 0.53],
		[83.8, 253.4, -14.4, 1.16, 7, 0, 0.87],
		[104.0, 252.2, -3.7, 1.13, 9, 0, 0.89],
		[118.9, 253.8, 3.1, 1.08, 7, 1, 0.86],
		[137.4, 256.8, -0.2, 1.72, 6, 0, 0.85],
		[158.4, 256.7, -3.7, 1.28, 3, 3, 0.5],
		[171.7, 253.4, -17.7, 1.25, 5, 2, 0.59],
		[189.9, 256.3, -3.5, 1.26, 6, 0, 0.99],
		[213.6, 254.8, -11.1, 1.15, 6, 2, 0.58],
		[225.3, 257.3, -12.4, 1.22, 4, 1, 0.82],
		[247.4, 258.3, -1.2, 1.39, 5, 1, 0.83],
		[262.7, 255.2, 2.9, 1.45, 8, 2, 0.71],
		[280.6, 258.9, 15.9, 1.49, 7, 2, 0.63],
		[301.7, 254.9, 3.9, 1.15, 12, 1, 0.83],
		[316.0, 256.1, -8.3, 1.38, 11, 3, 0.51],
		[337.5, 254.5, -14.9, 1.26, 3, 1, 0.96],
		[353.6, 257.3, 2.2, 1.04, 12, 2, 0.68],
		[371.4, 252.5, -9.8, 1.2, 6, 1, 0.96],
		[57.4, 276.1, 8.6, 1.07, 2, 2, 0.64],
		[76.5, 271.8, 0.7, 1.35, 9, 3, 0.65],
		[92.8, 270.0, 10.0, 1.62, 9, 2, 0.7],
		[112.9, 270.4, -14.0, 1.15, 5, 2, 0.55],
		[132.0, 270.7, -3.8, 1.51, 1, 1, 0.86],
		[146.8, 277.6, -5.7, 1.3, 10, 3, 0.61],
		[167.6, 273.4, 15.4, 1.36, 3, 1, 0.9],
		[180.3, 275.6, -8.6, 1.59, 10, 1, 0.99],
		[199.9, 272.1, -12.0, 1.72, 3, 2, 0.59],
		[221.1, 271.1, -0.5, 1.5, 3, 3, 0.55],
		[234.0, 275.5, 5.1, 1.06, 11, 2, 0.53],
		[253.1, 274.5, 11.4, 1.22, 2, 3, 0.67],
		[275.4, 271.2, 12.2, 1.73, 1, 3, 0.68],
		[293.5, 270.1, -16.4, 1.34, 1, 2, 0.57],
		[311.6, 273.6, -6.3, 1.04, 4, 3, 0.63],
		[325.3, 270.6, 17.7, 0.96, 11, 3, 0.52],
		[344.7, 275.9, 5.2, 1.16, 12, 3, 0.61],
		[364.3, 270.1, 5.2, 1.69, 1, 2, 0.64],
		[82.3, 291.5, -14.8, 1.73, 7, 0, 0.97],
		[100.5, 293.8, 12.3, 0.95, 1, 3, 0.53],
		[122.3, 292.1, -5.8, 1.29, 2, 3, 0.5],
		[142.2, 289.3, -2.0, 1.19, 7, 2, 0.62],
		[153.7, 290.6, 17.0, 1.32, 9, 1, 0.99],
		[176.0, 294.5, 6.4, 1.0, 6, 2, 0.62],
		[196.6, 291.8, -7.2, 1.47, 10, 2, 0.62],
		[207.2, 289.5, -1.9, 1.49, 9, 0, 0.83],
		[228.0, 292.6, 1.1, 1.28, 1, 3, 0.59],
		[244.8, 295.7, 9.0, 1.11, 4, 1, 0.97],
		[266.2, 289.5, 7.5, 1.49, 3, 1, 0.91],
		[283.3, 293.6, 14.7, 1.54, 10, 0, 0.97],
		[297.6, 291.5, 1.8, 1.64, 11, 0, 0.93],
		[319.1, 291.7, 1.6, 1.5, 12, 1, 0.91],
		[333.7, 291.0, -3.4, 1.45, 0, 0, 0.87],
		[234.8, 312.3, -9.4, 1.58, 4, 1, 0.94],
		[259.7, 308.7, 12.7, 1.24, 8, 1, 0.87],
		[275.7, 308.7, 6.2, 1.51, 3, 3, 0.61],
		[294.5, 314.0, -10.6, 1.07, 6, 3, 0.59],
		[310.5, 308.4, -15.6, 1.09, 4, 2, 0.66],
		[229.0, 328.4, 15.8, 1.1, 2, 2, 0.66],
		[250.0, 330.8, 1.0, 1.57, 3, 2, 0.67],
		[264.5, 330.9, 14.8, 1.12, 5, 3, 0.6],
		[285.3, 324.2, -17.4, 1.48, 5, 3, 0.65],
		[297.5, 328.5, 15.1, 1.28, 0, 1, 0.81],
		[221.5, 347.8, 11.7, 1.74, 9, 0, 0.82],
		[240.3, 349.3, 7.0, 0.99, 7, 2, 0.65],
		[256.4, 344.5, -18.0, 1.73, 9, 3, 0.61],
		[274.4, 345.0, 10.5, 1.61, 1, 3, 0.58],
		[225.7, 366.8, -17.4, 1.41, 12, 3, 0.52],
		[244.7, 363.6, -10.8, 1.61, 0, 2, 0.61],
		[265.4, 366.0, -13.0, 1.62, 10, 3, 0.68],
	];
	var PATHS = [
		"m143.08 211.84h29.629v79.031h-58.867q-35.087 0-54.969-20.977-19.882-20.983-19.882-57.647v-72.921h-38.985v-22.406l104.87-116.92h18.713v70.884h47.952v68.439h-45.223v54.996q0 7.7402 4.4859 12.629 4.4807 4.8885 12.278 4.8885z",
		"m214.95 148.93h-30.037v-78.746h59.679q35.57 0 55.727 20.901 20.156 20.907 20.156 57.438v72.657h39.522v22.325l-106.32 116.5h-18.971v-70.628h-48.613v-68.192h45.846v-54.797q0-7.7122-4.5477-12.583-4.5425-4.8708-12.447-4.8708z",
	];
	var PAL = ["#4f4b63", "#f04f26", "#8783a0", "#ff9470"];
	var CHIPS = [
		"+1 lead",
		"+1 conversion",
		"ROAS 4.2x",
		"CPL -84%",
		"+37 inquiries",
		"Tracked to revenue",
	];

	// ==================================================================
	// CONFIG: tweak the animation here. Values are read every frame, so from the browser console you can
	// also edit them live, e.g. analyttHero.config.gather.startMin = 40. Timing values (introDuration,
	// duration, delay, ease) apply the next time you call analyttHero.replay().
	// Distances are in logo units: the logo is 360 wide, so its corners are about 255 from the centre.
	// ==================================================================
	var CONFIG = {
		gather: {
			startMin: 70, // closest an icon can start from the logo centre
			startSpread: 110, // random extra distance on top of startMin (so icons start 70 to 180 away)
			startDepth: 120, // how far icons scatter toward / away from the camera (z)
			swirl: 1.8, // radians of spiral rotation while travelling in
			spin: 9, // radians of per-icon spin while travelling in
			drift: 10, // idle wobble of the cloud before it gathers
			span: 0.45, // share of the timeline each icon spends travelling (higher = less stagger)
			jitter: 0.3, // 0 = strict spiral order, 1 = fully random order (per-icon stagger)
			fadeIn: 0.3, // share of each icon's own travel spent fading from 0 to full opacity
			introDuration: 0.2, // seconds for the ambient side icons to fade in
			delay: 0, // seconds before the first icon starts
			duration: 1.8, // seconds for the whole gather, first icon to last
			ease: "power1.inOut",
		},
		pointer: { radius: 62, push: 36, lift: 46 },
		splash: { radius: 105, power: 1 },
		bubbles: { opacity: 1 }, // ambient icons drifting up the sides (0 hides them)
		parallax: 1, // 3D tilt with the cursor (0 = flat)
		logo: {
			scale: 0.55, // overall logo size, silhouette AND icons together (1 = original, .75 = 25% smaller)
			scaleMobile: 0.75, // same, but for screens narrower than 1080px
			offsetX: 0, // nudge the logo horizontally, in px (+ = right)
			offsetY: 0, // nudge the logo vertically, in px (+ = down)
		},
	};

	var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var hero = heroEl;
	var canvas = canvasEl;
	var hasGsap = !!gsap;
	var disposed = false;

	function hexRGB(h) {
		return [
			parseInt(h.slice(1, 3), 16) / 255,
			parseInt(h.slice(3, 5), 16) / 255,
			parseInt(h.slice(5, 7), 16) / 255,
		];
	}

	// ------------------------------------------------------------------
	// Three.js scene
	// ------------------------------------------------------------------
	var renderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			alpha: true,
			// Every glyph edge comes from the atlas alpha channel, not from
			// geometry edges, so MSAA buys nothing here and costs fill-rate
			// and bandwidth. The scene is also a single blended layer with
			// depth test disabled, so neither depth nor stencil is needed.
			antialias: false,
			depth: false,
			stencil: false,
			powerPreference: "high-performance",
		});
	} catch (err) {
		hero.classList.add("no-gl");
		return;
	}
	renderer.setClearColor(0x000000, 0);
	renderer.sortObjects = false;

	var FOV = 35;
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(FOV, 1, 10, 6000);
	var group = new THREE.Group();
	scene.add(group);

	// ---- icon atlas, rebuilt from the SVG glyph set ----
	// All icons below are the path data of the 17 SVGs that ship beside
	// this module (bell, bullhorn, bullseye, cellphone, email, google,
	// heart, hubspot, message, meta, play-circle, play, pound, share,
	// share-variant, thumb-up, tiktok). They are drawn white on a 5x4
	// atlas so the shader can tint every instance with PAL. The glyphs are
	// authored on a 24x24 grid; ICON_UNITS keeps the same 20-unit visual
	// footprint the previous hand-drawn set used.
	var ATLAS_COLS = 5,
		ATLAS_ROWS = 4,
		CELL = 128,
		K = 5.2,
		ICON_VIEWBOX = 24,
		ICON_UNITS = 20,
		ICON_S = ICON_UNITS / ICON_VIEWBOX;
	var ICON_PATHS = [
		// 0 - bullhorn
		"M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z",
		// 1 - bullseye
		"M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z",
		// 2 - heart
		"M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z",
		// 3 - share
		"M21,12L14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12Z",
		// 4 - play-circle
		"M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
		// 5 - message
		"M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z",
		// 6 - cellphone
		"M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z",
		// 7 - email
		"M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z",
		// 8 - pound / hash
		"M5.41,21L6.12,17H2.12L2.47,15H6.47L7.53,9H3.53L3.88,7H7.88L8.59,3H10.59L9.88,7H15.88L16.59,3H18.59L17.88,7H21.88L21.53,9H17.53L16.47,15H20.47L20.12,17H16.12L15.41,21H13.41L14.12,17H8.12L7.41,21H5.41M9.53,9L8.47,15H14.47L15.53,9H9.53Z",
		// 9 - bell
		"M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21",
		// 10 - share-variant
		"M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z",
		// 11 - thumb-up
		"M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z",
		// 12 - google
		"M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
		// 13 - meta
		"M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z",
		// 14 - hubspot
		"M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z",
		// 15 - tiktok
		"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
		// 16 - play
		"M8,5.14V19.14L19,12.14L8,5.14Z",
	];
	var ICON_COUNT = ICON_PATHS.length;
	// Path2D objects are immutable and reused for every atlas rebuild; no
	// path parsing happens after init.
	var ICON_SHAPES = ICON_PATHS.map(function (d) {
		return new Path2D(d);
	});
	// The plain play glyph is optically small next to the full-bleed marks
	// (its source art only occupies 11x14 of the 24-unit grid). Scale and
	// centre it so it reads at the same weight in the collage.
	var ICON_TWEAKS = {
		16: { s: 1.4, x: -1.5, y: -0.14 },
	};

	function buildAtlas() {
		var cv = document.createElement("canvas");
		cv.width = CELL * ATLAS_COLS;
		cv.height = CELL * ATLAS_ROWS;
		var g = cv.getContext("2d");
		g.fillStyle = "#fff";
		ICON_SHAPES.forEach(function (shape, i) {
			var tweak = ICON_TWEAKS[i];
			var s = ICON_S * (tweak ? tweak.s : 1);
			g.save();
			g.translate(
				(i % ATLAS_COLS) * CELL + CELL / 2,
				Math.floor(i / ATLAS_COLS) * CELL + CELL / 2
			);
			// 24-unit SVG grid -> 20 logo units -> atlas pixels.
			g.scale(K * s, K * s);
			g.translate(
				-ICON_VIEWBOX / 2 + (tweak ? tweak.x : 0),
				-ICON_VIEWBOX / 2 + (tweak ? tweak.y : 0)
			);
			g.fill(shape);
			g.restore();
		});
		var t = new THREE.CanvasTexture(cv);
		t.generateMipmaps = true;
		t.minFilter = THREE.LinearMipmapLinearFilter;
		t.magFilter = THREE.LinearFilter;
		t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
		return t;
	}

	// ---- logo silhouette mask: icons are clipped to this once they settle ----
	var maskCv = document.createElement("canvas");
	maskCv.width = maskCv.height = 512;
	var mg = maskCv.getContext("2d");
	mg.scale(512 / 360, 512 / 360);
	mg.fillStyle = "#fff";
	PATHS.forEach(function (d) {
		mg.fill(new Path2D(d));
	});
	var maskTex = new THREE.CanvasTexture(maskCv);
	maskTex.minFilter = THREE.LinearFilter;
	maskTex.generateMipmaps = false;

	// ---- instanced icons ----
	var AMBIENT = 40;
	var N = TILES.length + AMBIENT;
	var aTarget = new Float32Array(N * 3);
	var aParam = new Float32Array(N * 4);
	var aSeed = new Float32Array(N * 4);
	var aColor = new Float32Array(N * 3);
	var aMeta = new Float32Array(N * 2);

	function rnd() {
		return Math.random();
	}
	function put(i, x, y, z, rot, sc, type, ci, alpha, delay, clip) {
		aTarget[i * 3] = x;
		aTarget[i * 3 + 1] = y;
		aTarget[i * 3 + 2] = z;
		aParam[i * 4] = rot;
		aParam[i * 4 + 1] = sc;
		aParam[i * 4 + 2] = type;
		aParam[i * 4 + 3] = alpha;
		aSeed[i * 4] = rnd();
		aSeed[i * 4 + 1] = rnd();
		aSeed[i * 4 + 2] = rnd();
		aSeed[i * 4 + 3] = rnd();
		var c = hexRGB(PAL[ci]);
		aColor[i * 3] = c[0];
		aColor[i * 3 + 1] = c[1];
		aColor[i * 3 + 2] = c[2];
		aMeta[i * 2] = delay;
		aMeta[i * 2 + 1] = clip;
	}
	var order = new Float32Array(TILES.length);
	TILES.forEach(function (t, i) {
		var x = t[0] - 180,
			y = 180 - t[1];
		// gather order: a spiral from the centre outward
		var r = Math.min(1, Math.sqrt(x * x + y * y) / 255);
		var a = (Math.atan2(y, x) + Math.PI) / (Math.PI * 2);
		order[i] = 0.6 * r + 0.4 * a;
		// Rotate through the full icon set. The old type column only had 13
		// entries; this keeps each tile's authored scale/rotation/colour but
		// lets the brand and utility marks coexist in the collage.
		var type = (t[4] + i * 3) % ICON_COUNT;
		put(
			i,
			x,
			y,
			(rnd() - 0.5) * 70,
			(-t[2] * Math.PI) / 180,
			t[3],
			type,
			t[5],
			t[6],
			order[i],
			1
		);
	});
	// ambient "ad bubbles" that drift upward on both sides of the mark
	for (var k = 0; k < AMBIENT; k++) {
		var side = rnd() < 0.5 ? -1 : 1;
		var ci = [0, 1, 2, 3, 2, 3][Math.floor(rnd() * 6)];
		put(
			TILES.length + k,
			side * (205 + rnd() * 190),
			0,
			(rnd() - 0.5) * 220,
			(rnd() - 0.5) * 1.2,
			0.9 + rnd() * 1.4,
			Math.floor(rnd() * ICON_COUNT),
			ci,
			0.25 + rnd() * 0.3,
			0,
			0
		);
	}

	// stagger: blend the spiral order with randomness. Re-rolled on every replay().
	function applyStagger() {
		var J = Math.max(0, Math.min(1, CONFIG.gather.jitter));
		for (var i = 0; i < TILES.length; i++) {
			aMeta[i * 2] = Math.max(0, Math.min(1, order[i] * (1 - J) + rnd() * J));
		}
		if (geo && geo.attributes && geo.attributes.aMeta) geo.attributes.aMeta.needsUpdate = true;
	}
	var geo = null;
	var base = new THREE.PlaneGeometry(1, 1);
	geo = new THREE.InstancedBufferGeometry();
	geo.index = base.index;
	geo.setAttribute("position", base.attributes.position);
	geo.setAttribute("uv", base.attributes.uv);
	geo.instanceCount = N;
	geo.setAttribute("aTarget", new THREE.InstancedBufferAttribute(aTarget, 3));
	geo.setAttribute("aParam", new THREE.InstancedBufferAttribute(aParam, 4));
	geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(aSeed, 4));
	geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(aColor, 3));
	geo.setAttribute("aMeta", new THREE.InstancedBufferAttribute(aMeta, 2));

	var U = {
		uProgress: { value: reduce ? 1 : 0 }, // 0 = scattered cloud, 1 = silhouette formed
		uIntro: { value: reduce ? 1 : 0 }, // fades in the ambient side icons
		uTime: { value: 0 },
		uMotion: { value: reduce ? 0 : 1 },
		uMouse: { value: new THREE.Vector2(9999, 9999) },
		uMouseOn: { value: 0 },
		uHotR: { value: CONFIG.pointer.radius },
		uPush: { value: CONFIG.pointer.push },
		uLift: { value: CONFIG.pointer.lift },
		uSplashR: { value: CONFIG.splash.radius },
		uSplashP: { value: CONFIG.splash.power },
		uBubbles: { value: CONFIG.bubbles.opacity },
		uStartMin: { value: CONFIG.gather.startMin },
		uStartSpr: { value: CONFIG.gather.startSpread },
		uStartZ: { value: CONFIG.gather.startDepth },
		uSwirl: { value: CONFIG.gather.swirl },
		uSpin: { value: CONFIG.gather.spin },
		uDrift: { value: CONFIG.gather.drift },
		uSpan: { value: CONFIG.gather.span },
		uFade: { value: CONFIG.gather.fadeIn },
		uClick: { value: new THREE.Vector4(0, 0, 9, 0) },
		uQuad: { value: CELL / K },
		uAtlas: { value: buildAtlas() },
		uMask: { value: maskTex },
	};

	var vert = [
		"precision highp float;",
		"attribute vec3 aTarget; attribute vec4 aParam; attribute vec4 aSeed; attribute vec3 aColor; attribute vec2 aMeta;",
		"uniform float uProgress; uniform float uIntro; uniform float uTime; uniform float uMotion; uniform float uMouseOn; uniform float uHotR; uniform float uQuad;",
		"uniform float uPush; uniform float uLift; uniform float uSplashR; uniform float uSplashP; uniform float uBubbles;",
		"uniform float uStartMin; uniform float uStartSpr; uniform float uStartZ; uniform float uSwirl; uniform float uSpin; uniform float uDrift; uniform float uSpan; uniform float uFade;",
		"uniform vec2 uMouse; uniform vec4 uClick;",
		"varying vec2 vUv; varying vec3 vColor; varying float vAlpha; varying float vType; varying float vClip; varying vec2 vMaskPos;",
		"vec2 rot2(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c*p.x - s*p.y, s*p.x + c*p.y); }",
		"float easeOutCubic(float t){ return 1. - pow(1. - t, 3.); }",
		"float easeOutBack(float t){ float c1 = 1.6; float c3 = c1 + 1.; float x = t - 1.; return 1. + c3*x*x*x + c1*x*x; }",
		"void main(){",
		"  float isClip = aMeta.y;",
		"  float tt = uTime * uMotion;",
		"  vec3 pos; float rot = aParam.x; float scl = aParam.y; float alpha = aParam.w;",
		"  float hot = 0.; float free = 0.; float local = 1.;",
		// staggered pop-in of the scattered cloud
		"  if (isClip > .5) {",
		// gather: each icon leaves the cloud on its own delay and spirals into its place in the silhouette
		"    float span = uSpan;",
		"    local = clamp((uProgress - aMeta.x * (1. - span)) / span, 0., 1.);",
		"    float ep = easeOutCubic(local);",
		"    float es = max(easeOutBack(local), 0.);",
		"    float ang = aSeed.x * 6.2831853;",
		"    float rad = uStartMin + aSeed.y * uStartSpr;",
		"    vec3 start = vec3(cos(ang) * rad, sin(ang) * rad, (aSeed.z - .5) * uStartZ);",
		"    start.xy += vec2(sin(tt*.5 + aSeed.w*20.), cos(tt*.45 + aSeed.z*20.)) * uDrift;",
		"    vec3 rest = aTarget + vec3(cos(tt*.9 + aSeed.y*20.) * 1.8, sin(tt*1.2 + aSeed.x*20.) * 2.6, sin(tt*.5 + aSeed.z*20.) * 5.) * ep;",
		"    pos = mix(start, rest, ep);",
		"    pos.xy = rot2(pos.xy, (1. - ep) * (aSeed.w - .5) * uSwirl);",
		"    rot += (1. - ep) * (aSeed.z - .5) * uSpin + sin(tt*.8 + aSeed.z*20.) * .1 * ep;",
		// pointer: icons near the cursor are pushed away, lifted and lit up
		"    vec2 dm = pos.xy - uMouse; float dist = length(dm);",
		"    float f = (1. - smoothstep(0., uHotR, dist)) * uMouseOn * ep;",
		"    pos.xy += dm / (dist + .001) * f * uPush * uMotion;",
		"    pos.z += f * uLift * uMotion;",
		"    hot += f;",
		// click splash: icons near the click leap out on a ballistic arc, then land back in the silhouette
		"    vec2 dc = aTarget.xy - uClick.xy; float dcl = length(dc);",
		"    float sw = (1. - smoothstep(0., uSplashR, dcl)) * uClick.w * uMotion * uSplashP * step(.99, ep);",
		"    vec2 vel = vec2((aSeed.x - .5) * 230. + dc.x * 1.4, 240. + aSeed.y * 200.) * sw;",
		"    float Ti = 2. * vel.y / 640.;",
		"    float tau = uClick.z - dcl * .0022 - aSeed.z * .07;",
		"    float act = step(0., tau) * (1. - step(Ti, tau)) * step(.05, Ti);",
		"    pos.xy += vec2(vel.x * tau, vel.y * tau - 320. * tau * tau) * act;",
		"    rot += act * tau * 7. * sign(aSeed.w - .5);",
		"    hot += act * .6;",
		"    free = act;",
		"    scl *= mix(.35, 1., es) * (1. + min(hot, 1.) * .3);",
		"    alpha *= smoothstep(0., max(uFade, .001), local);",
		"  } else {",
		// ambient bubbles drifting up past the mark
		"    float prog = fract(aSeed.y + uTime * uMotion * (.02 + aSeed.z * .03));",
		"    pos = aTarget;",
		"    pos.y = -330. + prog * 660.;",
		"    pos.x += sin(prog * 9. + aSeed.w * 6.28318) * 14.;",
		"    alpha *= sin(prog * 3.14159) * uIntro * uBubbles;",
		"    scl *= .85 + .3 * sin(prog * 6. + aSeed.x * 6.28318);",
		"  }",
		"  hot = clamp(hot, 0., 1.);",
		"  vec2 q = rot2(position.xy * uQuad * scl, rot);",
		"  vMaskPos = aTarget.xy + q;",
		"  vec3 accent = vec3(.941, .31, .149); vec3 ink = vec3(.165, .153, .208);",
		"  vColor = mix(aColor, mix(accent, ink, step(.8, aColor.r)), hot);",
		"  vAlpha = min(1., alpha + hot * .4);",
		"  vClip = isClip * smoothstep(.7, 1., local) * (1. - free);",
		"  vType = aParam.z; vUv = uv;",
		"  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xy + q, pos.z, 1.);",
		"}",
	].join("\n");

	var frag = [
		"precision highp float;",
		"uniform sampler2D uAtlas; uniform sampler2D uMask;",
		"varying vec2 vUv; varying vec3 vColor; varying float vAlpha; varying float vType; varying float vClip; varying vec2 vMaskPos;",
		"void main(){",
		"  float col = mod(vType, " +
			ATLAS_COLS +
			".0); float row = floor(vType / " +
			ATLAS_COLS +
			".0);",
		"  vec2 uv = vec2((col + vUv.x) / " +
			ATLAS_COLS +
			".0, 1. - (row + 1.) / " +
			ATLAS_ROWS +
			".0 + vUv.y / " +
			ATLAS_ROWS +
			".0);",
		"  float a = texture2D(uAtlas, uv).a;",
		// Reject fully transparent glyph pixels before the mask fetch: most
		// fragments in a quad are empty, and unclipped icons skip the second
		// texture sample entirely until they settle into the silhouette.
		"  if (a < .01) discard;",
		"  a *= vAlpha;",
		"  if (a < .01) discard;",
		"  if (vClip > .001) {",
		"    float m = texture2D(uMask, vMaskPos / 360. + .5).a;",
		"    a *= mix(1., m, vClip);",
		"    if (a < .01) discard;",
		"  }",
		"  gl_FragColor = vec4(vColor, a);",
		"}",
	].join("\n");

	var icons = new THREE.Mesh(
		geo,
		new THREE.ShaderMaterial({
			uniforms: U,
			vertexShader: vert,
			fragmentShader: frag,
			transparent: true,
			depthWrite: false,
			depthTest: false,
		})
	);
	icons.frustumCulled = false;
	group.add(icons);

	// ------------------------------------------------------------------
	// Layout: 1 world unit = 1 CSS px at z = 0; logo sits right on desktop, on top on mobile
	// ------------------------------------------------------------------
	var W = 1,
		H = 1,
		gScale = 1;
	var rectLeft = 0,
		rectTop = 0,
		rectValid = false;
	var lgCache = { scale: NaN, scaleMobile: NaN, offsetX: NaN, offsetY: NaN };
	var resizeRaf = 0;

	function layout() {
		var desk = W >= 1080,
			size,
			cx,
			cy;
		if (desk) {
			size = Math.min(H * 0.78, W * 0.42) * CONFIG.logo.scale;
			cx = W * 0.725;
			cy = H * 0.5 + 14;
		} else {
			size = Math.min(W * 0.8, H * 0.38) * CONFIG.logo.scaleMobile;
			cy = 84 + Math.min(W * 0.8, H * 0.38) / 2;
			cx = W / 2;
		}
		cx += CONFIG.logo.offsetX;
		cy += CONFIG.logo.offsetY;
		gScale = size / 360;
		group.scale.setScalar(gScale);
		group.position.set(cx - W / 2, H / 2 - cy, 0);
	}
	// Pixel budget: never above min(dpr, 2), stepping down adaptively
	// while the average frame stays over ~29ms.
	var baseZ = 1,
		prStep = 0;
	var PR_STEPS = [2, 1.5, 1.25, 1];
	function currentPR() {
		return Math.min(window.devicePixelRatio || 1, PR_STEPS[prStep]);
	}
	function resize() {
		var r = hero.getBoundingClientRect();
		W = Math.max(1, r.width);
		H = Math.max(1, r.height);
		// Reuse this layout read for pointer coordinates as well.
		rectLeft = r.left;
		rectTop = r.top;
		rectValid = true;
		renderer.setPixelRatio(currentPR());
		renderer.setSize(W, H, false);
		camera.aspect = W / H;
		camera.position.z = H / 2 / Math.tan((FOV * Math.PI) / 360);
		baseZ = camera.position.z;
		camera.far = camera.position.z * 3 + 3000;
		camera.updateProjectionMatrix();
		layout();
	}
	// ResizeObserver can fire in bursts while a window is being dragged.
	// Coalesce those into one layout/render-target update per frame.
	function scheduleResize() {
		if (resizeRaf || disposed) return;
		resizeRaf = requestAnimationFrame(function () {
			resizeRaf = 0;
			if (!disposed) resize();
		});
	}
	resize();
	var ro = null;
	if (window.ResizeObserver) {
		ro = new ResizeObserver(scheduleResize);
		ro.observe(hero);
	} else window.addEventListener("resize", scheduleResize);

	// ------------------------------------------------------------------
	// Pointer interaction
	// ------------------------------------------------------------------
	var ptr = { px: 0, py: 0, sx: 9999, sy: 9999, on: 0, target: 0, nx: 0, ny: 0, seen: false };
	var localTmp = [0, 0];
	function toLocal(px, py) {
		localTmp[0] = (px - W / 2 - group.position.x) / gScale;
		localTmp[1] = (H / 2 - py - group.position.y) / gScale;
		return localTmp;
	}
	function refreshRect() {
		var r = hero.getBoundingClientRect();
		rectLeft = r.left;
		rectTop = r.top;
		rectValid = true;
	}
	function onMove(e) {
		// getBoundingClientRect() only after a scroll/resize invalidates the
		// cached value, instead of on every pointer event.
		if (!rectValid) refreshRect();
		ptr.px = e.clientX - rectLeft;
		ptr.py = e.clientY - rectTop;
		ptr.nx = (ptr.px / W) * 2 - 1;
		ptr.ny = (ptr.py / H) * 2 - 1;
		ptr.target = 1;
		if (!ptr.seen) {
			var l = toLocal(ptr.px, ptr.py);
			ptr.sx = l[0];
			ptr.sy = l[1];
			ptr.seen = true;
		}
	}
	function invalidateRect() {
		rectValid = false;
	}
	var clickT0 = -10,
		chipI = 0;
	// DOM effects created by clicks are tracked so a dispose mid-animation
	// cannot leave orphaned nodes or live tweens behind.
	var fxEls = [];
	function releaseFx(el) {
		var i = fxEls.indexOf(el);
		if (i !== -1) fxEls.splice(i, 1);
		if (el.parentNode) el.parentNode.removeChild(el);
	}
	function splash(e) {
		if (getP() > 0.79) return; // parked: the portal owns the stage now
		if (e.target.closest && e.target.closest("a,button")) return;
		// A touch can start without a prior pointerenter, and the hero may
		// have shifted since the last scroll. One rect read per click is
		// cheap and keeps the splash anchored to the real pointer position.
		rectValid = false;
		onMove(e);
		var l = toLocal(ptr.px, ptr.py);
		U.uClick.value.set(l[0], l[1], 0, 1);
		clickT0 = performance.now();
		if (reduce || !hasGsap) return;

		var ring = document.createElement("div");
		ring.className =
			"pointer-events-none absolute z-20 rounded-full border-[1.5px] border-accent";
		var D = 2 * 210 * gScale;
		ring.style.cssText =
			"left:" + ptr.px + "px;top:" + ptr.py + "px;width:" + D + "px;height:" + D + "px;";
		hero.appendChild(ring);
		fxEls.push(ring);
		gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0.5 });
		gsap.to(ring, { scale: 1, duration: 0.9, ease: "power2.out" });
		gsap.to(ring, {
			opacity: 0,
			duration: 0.9,
			ease: "power2.in",
			onComplete: function () {
				releaseFx(ring);
			},
		});

		var chip = document.createElement("div");
		chip.className =
			"pointer-events-none absolute z-40 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-primary/20 bg-white px-[13px] py-[7px] text-[.78rem] font-semibold text-primary shadow-[0_8px_24px_-10px_rgba(42,39,53,.35)]";
		chip.innerHTML =
			'<span class="h-[7px] w-[7px] rounded-full bg-accent"></span>' +
			CHIPS[chipI++ % CHIPS.length];
		chip.style.left = ptr.px + "px";
		chip.style.top = ptr.py - 28 + "px";
		hero.appendChild(chip);
		fxEls.push(chip);
		gsap.fromTo(
			chip,
			{ xPercent: -50, yPercent: -50, y: 0, opacity: 0, scale: 0.8 },
			{ y: -26, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }
		);
		gsap.to(chip, {
			y: -78,
			opacity: 0,
			duration: 0.7,
			delay: 0.85,
			ease: "power2.in",
			onComplete: function () {
				releaseFx(chip);
			},
		});
	}
	function onLeave() {
		ptr.target = 0;
	}
	function onUp(e) {
		if (e.pointerType === "touch") ptr.target = 0;
	}
	var passiveOpts = { passive: true };
	hero.addEventListener("pointermove", onMove, passiveOpts);
	hero.addEventListener("pointerenter", invalidateRect, passiveOpts);
	hero.addEventListener("pointerdown", splash, passiveOpts);
	hero.addEventListener("pointerleave", onLeave, passiveOpts);
	hero.addEventListener("pointerup", onUp, passiveOpts);
	hero.addEventListener("pointercancel", onLeave, passiveOpts);
	// The hero moves with the page; only re-read its box lazily after scroll.
	// Capture-phase on document also notices scrollable ancestors.
	document.addEventListener("scroll", invalidateRect, { passive: true, capture: true });

	// ------------------------------------------------------------------
	// Intro: icons pop into a scattered cloud, then gather into the logo silhouette
	// ------------------------------------------------------------------
	// Counter targets are parsed once; writes only happen when the rounded
	// number actually changes, so the intro does not force a text layout
	// every frame.
	var counters = [].slice.call(heroEl.querySelectorAll("[data-to]")).map(function (el) {
		return {
			el: el,
			pre: el.getAttribute("data-pre") || "",
			to: parseFloat(el.getAttribute("data-to")) || 0,
			suf: el.getAttribute("data-suf") || "",
			shown: NaN,
		};
	});
	function setCounters(p) {
		for (var i = 0; i < counters.length; i++) {
			var c = counters[i];
			var v = Math.round(c.to * p);
			if (v !== c.shown) {
				c.shown = v;
				c.el.textContent = c.pre + v + c.suf;
			}
		}
	}
	var tl = null,
		introDone = false;
	function play() {
		if (disposed) return;
		if (tl) tl.kill();
		// Scroll takes over uProgress only once the intro lands, so the tween
		// and the scrub never fight over the same uniform.
		introDone = false;
		var G = CONFIG.gather;
		applyStagger();
		if (reduce || !hasGsap) {
			U.uIntro.value = 1;
			U.uProgress.value = 1;
			setCounters(1);
			introDone = true;
			return;
		}
		U.uIntro.value = 0;
		U.uProgress.value = 0;
		setCounters(0);
		tl = gsap.timeline();
		tl.to(U.uIntro, { value: 1, duration: G.introDuration, ease: "none" }, 0.2 + G.delay).to(
			U.uProgress,
			{
				value: 1,
				duration: G.duration,
				ease: G.ease,
				onUpdate: function () {
					setCounters(U.uProgress.value);
				},
				onComplete: function () {
					setCounters(1);
					introDone = true;
				},
			},
			0.2 + G.delay
		);
	}
	play();
	window.analyttHero = { config: CONFIG, replay: play };

	// ------------------------------------------------------------------
	// Render loop — reads scroll progress imperatively, draws nothing once
	// the portal covers the stage, and pauses entirely off-screen.
	// ------------------------------------------------------------------
	var clock = new THREE.Clock(),
		time = 0;
	var tiltX = 0,
		tiltY = 0;
	var rafId = 0,
		running = true,
		inView = true;
	var emaMs = 16.67,
		drawn = 0,
		lastFrameTs = 0;

	var io = null;
	if (window.IntersectionObserver) {
		io = new IntersectionObserver(
			function (entries) {
				inView = entries[0].isIntersecting;
			},
			{ rootMargin: "100px" }
		);
		io.observe(hero);
	}
	function onContextLost(e) {
		if (e) e.preventDefault();
		hero.classList.add("no-gl");
		running = false;
		if (rafId) cancelAnimationFrame(rafId);
		rafId = 0;
		lastFrameTs = 0;
	}
	canvas.addEventListener("webglcontextlost", onContextLost);

	function tick(ts) {
		if (disposed) return;
		rafId = requestAnimationFrame(tick);
		var dt = Math.min(clock.getDelta(), 0.06);
		if (!running || !inView) {
			lastFrameTs = 0;
			return;
		}
		var p = getP();
		if (p > 0.65) {
			// flood circle done (PORTAL_RANGE ends at 0.6): the opaque flood
			// covers the stage, so hold the frame and draw nothing
			lastFrameTs = 0;
			return;
		}
		// Real frame interval (not just CPU submit time) catches GPU-bound
		// frames too. The first frame after a pause is skipped so a tab
		// switch cannot trigger a pixel-ratio step-down.
		if (lastFrameTs) {
			var frameMs = ts - lastFrameTs;
			if (frameMs > 0 && frameMs < 100) emaMs += (frameMs - emaMs) * 0.05;
		}
		lastFrameTs = ts;

		time += dt;
		U.uTime.value = time;
		var m = reduce ? 0 : 1;

		var G = CONFIG.gather;
		U.uStartMin.value = G.startMin;
		U.uStartSpr.value = G.startSpread;
		U.uStartZ.value = G.startDepth;
		U.uSwirl.value = G.swirl;
		U.uSpin.value = G.spin;
		U.uDrift.value = G.drift;
		U.uSpan.value = G.span;
		U.uHotR.value = CONFIG.pointer.radius;
		U.uLift.value = CONFIG.pointer.lift;
		U.uSplashR.value = CONFIG.splash.radius;
		U.uBubbles.value = CONFIG.bubbles.opacity;
		U.uFade.value = G.fadeIn;

		// Frame-rate-independent damping for every eased target below.
		var k = 1 - Math.exp(-dt / 0.11);

		// Portal choreography, all pure functions of scroll progress: no
		// rotation anywhere — the mark itself breathes with the scroll, loosening
		// toward its open cloud as the reader descends and re-gathering into the
		// logo on the way back up. The handover is damped, so arriving mid-scroll
		// (or a replay) eases instead of snapping.
		var scatterT = 1 - SCATTER_DEPTH * sstep(SCATTER_START, SCATTER_END, p);
		if (introDone) U.uProgress.value += (scatterT - U.uProgress.value) * k;
		// Pointer splash, push and parallax die as the flood starts opening;
		// the camera dollies in while the circle blooms (PORTAL_RANGE).
		var closeT = sstep(0.24, 0.36, p);
		U.uSplashP.value = CONFIG.splash.power * (1 - closeT);
		U.uPush.value = CONFIG.pointer.push * (1 - closeT * 0.5);
		camera.position.z = baseZ * (1 - sstep(0.35, 0.6, p) * 0.18);

		// Parked past 0.38: the flood owns the stage, pointer influence dies.
		var parked = p > 0.38;
		var l = toLocal(ptr.px, ptr.py);
		ptr.sx += (l[0] - ptr.sx) * 0.22;
		ptr.sy += (l[1] - ptr.sy) * 0.22;
		ptr.on += ((parked ? 0 : ptr.target) - ptr.on) * 0.1;
		U.uMouse.value.set(ptr.sx, ptr.sy);
		U.uMouseOn.value = ptr.on;

		// re-apply logo size/offset if edited live from the console
		var LG = CONFIG.logo;
		if (
			LG.scale !== lgCache.scale ||
			LG.scaleMobile !== lgCache.scaleMobile ||
			LG.offsetX !== lgCache.offsetX ||
			LG.offsetY !== lgCache.offsetY
		) {
			lgCache.scale = LG.scale;
			lgCache.scaleMobile = LG.scaleMobile;
			lgCache.offsetX = LG.offsetX;
			lgCache.offsetY = LG.offsetY;
			layout();
		}

		var click = (performance.now() - clickT0) / 1000;
		U.uClick.value.z = click;
		if (click > 2.8) U.uClick.value.w = 0;

		// gentle 3D parallax, damped toward its targets
		var pm = m * CONFIG.parallax * (1 - closeT);
		var txT = (-ptr.ny * 0.16 + Math.sin(time * 0.35) * 0.03) * pm;
		var tyT = (ptr.nx * 0.24 + Math.cos(time * 0.3) * 0.04) * pm;
		tiltX += (txT - tiltX) * k;
		tiltY += (tyT - tiltY) * k;
		group.rotation.x = tiltX;
		group.rotation.y = tiltY;

		renderer.render(scene, camera);

		// Adaptive pixel ratio: while the average frame stays over ~29ms,
		// step down the ladder. Never steps back up mid-visit.
		drawn += 1;
		if (drawn % 120 === 0 && emaMs > 29 && prStep < PR_STEPS.length - 1) {
			prStep += 1;
			renderer.setPixelRatio(currentPR());
		}
	}
	tick();

	return function () {
		if (disposed) return;
		disposed = true;
		if (rafId) cancelAnimationFrame(rafId);
		if (resizeRaf) cancelAnimationFrame(resizeRaf);
		if (tl) tl.kill();
		if (io) io.disconnect();
		if (ro) ro.disconnect();
		else window.removeEventListener("resize", scheduleResize);
		document.removeEventListener("scroll", invalidateRect, true);
		canvas.removeEventListener("webglcontextlost", onContextLost);
		hero.removeEventListener("pointermove", onMove);
		hero.removeEventListener("pointerenter", invalidateRect);
		hero.removeEventListener("pointerdown", splash);
		hero.removeEventListener("pointerleave", onLeave);
		hero.removeEventListener("pointerup", onUp);
		hero.removeEventListener("pointercancel", onLeave);
		// Click effects may still be mid-flight when the section unmounts.
		var fxs = fxEls.slice();
		for (var i = 0; i < fxs.length; i++) {
			if (hasGsap) gsap.killTweensOf(fxs[i]);
			releaseFx(fxs[i]);
		}
		fxEls.length = 0;
		if (geo) geo.dispose();
		if (base) base.dispose();
		if (icons && icons.material) icons.material.dispose();
		if (U.uAtlas.value) U.uAtlas.value.dispose();
		if (maskTex) maskTex.dispose();
		if (renderer) {
			// Leave the shared canvas transparent instead of showing the last
			// frame. The context itself is preserved so a StrictMode-style
			// remount can draw on the same canvas immediately.
			renderer.setClearColor(0x000000, 0);
			renderer.clear();
			renderer.dispose();
		}
		if (window.analyttHero && window.analyttHero.replay === play) delete window.analyttHero;
	};
}
