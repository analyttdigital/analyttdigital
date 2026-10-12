// @ts-nocheck
/* eslint-disable */
import * as THREE from 'three';
import gsap from 'gsap';

export function runHeroGather(heroEl: HTMLElement, canvasEl: HTMLCanvasElement, opts?: { getProgress?: () => number }): (() => void) | undefined {
  'use strict';

  // Portal choreography helpers. `sstep` mirrors `smooth` in
  // src/lib/motion/smooth.ts (kept local so this scene stays a single
  // dependency-free module whose CONFIG remains live-editable from the
  // console). `getP` is the hero's scroll progress, read imperatively.
  function sstep(a, b, x){ var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  var getP = (opts && opts.getProgress) || function(){ return 0; };
  // Scroll-driven scatter window (fractions of `p`) and depth: the gather
  // uniform rests at 1 (logo formed) and falls to 1 - SCATTER_DEPTH while
  // the portal beat runs, so the mark loosens toward its open cloud on the
  // way down and re-forms on the way back up. Keyed to PORTAL_RANGE
  // ([0.35, 0.6] in src/lib/motion/portal.ts): the scatter finishes just
  // before the flood circle starts opening, so the bloom grows out of a
  // loosened cloud. Depth stops at 0.35, not 0:
  // at 0 every icon's alpha hits zero and the cloud would vanish instead
  // of visibly scattering.
  var SCATTER_START = 0.22, SCATTER_END = 0.34, SCATTER_DEPTH = 0.65;

  // tile = [x, y, rotationDeg, scale, iconType, paletteIndex, alpha] in the 360x360 SVG space
  var TILES = [[112.2,-11.0,-7.6,1.53,6,0,0.82],[127.3,-15.3,-2.8,1.7,9,0,0.95],[86.9,1.8,-5.2,1.36,12,0,1.0],[101.2,2.1,16.4,1.5,11,3,0.68],[124.9,7.6,-10.1,1.24,5,1,0.89],[136.6,5.0,12.3,1.67,5,3,0.7],[75.7,23.6,0.6,1.26,1,2,0.61],[90.9,25.3,13.6,1.13,0,0,0.85],[115.2,19.5,11.5,1.55,8,2,0.59],[133.4,22.6,-14.8,1.51,2,0,0.96],[52.1,41.0,11.2,1.54,12,1,0.98],[67.0,42.7,11.8,1.59,0,1,0.82],[82.1,38.9,12.1,1.03,10,0,0.93],[103.3,38.0,-1.5,1.16,8,0,0.95],[124.2,36.7,8.8,1.37,1,3,0.56],[38.4,58.5,-12.0,1.27,8,1,0.82],[61.2,58.0,14.6,1.13,8,3,0.59],[73.5,54.7,-14.7,1.22,12,1,0.87],[94.6,61.1,-3.1,1.55,3,3,0.66],[111.0,56.7,-8.0,1.0,8,2,0.53],[130.2,60.3,-14.7,1.63,10,1,0.88],[147.6,61.6,13.4,1.63,6,0,0.83],[167.7,61.2,3.1,1.33,8,0,0.81],[186.8,61.8,-14.1,1.15,10,1,0.83],[198.9,60.6,12.5,1.51,12,3,0.52],[216.3,60.3,15.1,1.14,10,2,0.71],[236.0,59.1,-14.0,1.51,9,0,0.86],[253.5,56.1,-18.0,1.58,4,2,0.72],[277.7,59.2,-0.9,1.66,0,1,0.91],[34.1,77.9,15.5,1.75,10,2,0.54],[52.5,78.0,5.9,0.98,5,3,0.68],[66.5,72.9,-15.1,1.01,1,3,0.71],[85.5,78.1,9.7,1.25,6,2,0.68],[99.7,77.6,1.5,1.11,5,3,0.54],[122.9,75.8,-9.1,1.46,0,3,0.51],[138.7,78.4,-11.0,1.0,5,0,0.98],[155.9,74.7,-16.4,1.71,4,2,0.7],[171.0,78.0,4.8,1.68,3,0,0.8],[189.9,77.7,9.9,1.32,7,2,0.7],[208.1,76.0,15.5,0.96,12,2,0.68],[226.2,73.9,-1.4,1.64,6,0,0.9],[249.0,74.0,-16.8,1.0,6,2,0.54],[268.1,79.9,-15.0,1.16,11,0,0.88],[286.8,73.4,-1.4,1.06,12,1,0.95],[302.3,73.0,-7.4,1.62,11,2,0.58],[18.3,95.9,11.3,1.68,5,2,0.59],[37.5,92.5,10.6,1.11,1,3,0.51],[60.4,95.3,1.2,1.07,4,1,0.88],[75.3,92.3,16.3,1.2,5,2,0.66],[93.3,90.1,10.9,1.56,6,1,0.88],[109.6,90.0,-2.7,1.67,5,0,0.88],[129.7,91.3,1.9,0.96,9,3,0.52],[151.4,95.9,-5.5,1.09,1,1,0.9],[162.9,93.9,16.8,1.59,0,1,0.86],[187.8,93.9,15.3,0.99,11,3,0.52],[203.0,96.6,10.3,1.08,9,1,0.92],[222.8,96.6,-10.1,1.1,2,3,0.71],[237.1,91.0,8.1,1.15,8,1,0.81],[258.7,95.4,-6.3,1.48,8,3,0.63],[276.8,96.2,-6.9,1.47,10,1,0.89],[290.9,94.0,-17.9,1.09,7,3,0.6],[312.1,96.2,-11.5,1.32,1,3,0.59],[-6.7,114.5,6.7,1.59,5,1,0.81],[13.9,110.0,4.1,1.21,8,3,0.53],[34.7,111.8,4.2,1.42,0,1,0.86],[46.6,111.2,-8.0,1.46,2,2,0.7],[69.3,110.1,-16.3,1.56,7,2,0.71],[85.4,112.6,-14.2,1.66,5,3,0.66],[101.1,115.9,-5.0,1.41,2,0,0.89],[121.9,115.7,0.6,1.19,9,2,0.64],[142.4,115.2,8.9,1.54,9,1,0.83],[158.0,111.3,-16.3,1.24,10,3,0.55],[171.4,108.4,-7.1,1.4,6,2,0.62],[193.7,112.7,4.5,1.11,0,3,0.53],[214.5,109.9,-14.6,1.07,12,1,0.97],[227.2,114.5,-16.0,1.72,9,2,0.63],[246.6,115.5,-9.1,1.54,8,0,0.81],[261.2,109.5,14.8,1.08,8,0,0.8],[284.3,109.6,0.7,1.28,2,3,0.68],[301.1,108.5,17.8,1.45,0,3,0.66],[318.0,111.5,-15.1,1.68,1,3,0.54],[-10.7,127.5,3.6,1.26,10,3,0.7],[7.4,133.9,1.3,1.62,11,3,0.68],[18.1,126.2,-9.6,1.71,6,2,0.67],[41.0,126.6,-12.8,1.68,9,0,0.82],[61.4,128.8,-17.0,1.06,10,0,0.83],[77.1,131.6,-15.6,1.54,8,2,0.54],[97.1,126.5,14.9,1.64,3,3,0.52],[109.6,126.3,14.8,1.71,10,0,0.97],[131.1,129.8,10.5,1.06,5,1,0.86],[147.4,126.2,-7.8,1.16,12,2,0.7],[169.7,130.0,4.3,1.63,0,0,0.96],[183.5,132.2,7.4,1.23,1,1,0.94],[202.6,128.3,0.8,1.3,0,2,0.67],[216.0,129.9,10.7,1.34,9,1,0.99],[236.8,132.7,16.0,1.16,11,2,0.68],[253.9,127.3,9.6,1.7,11,3,0.67],[274.5,126.8,-14.6,1.21,11,3,0.7],[288.7,133.1,-10.6,0.97,8,2,0.59],[310.0,129.0,-9.6,1.66,9,3,0.53],[330.0,132.0,-5.5,1.47,7,2,0.61],[-2.4,148.9,17.1,1.53,5,2,0.63],[10.3,146.6,17.1,1.1,10,0,0.83],[27.8,147.1,10.6,1.74,3,2,0.6],[45.9,151.3,13.9,1.17,6,3,0.51],[69.8,147.5,17.3,1.13,2,2,0.6],[83.1,149.9,-9.3,0.95,9,3,0.65],[105.0,147.4,8.0,1.13,10,1,0.94],[118.0,147.5,7.2,1.16,6,3,0.55],[140.7,149.0,-2.8,1.15,6,3,0.5],[157.1,149.3,14.2,1.65,6,2,0.67],[177.7,151.3,-9.0,1.04,12,1,0.83],[196.6,145.6,12.5,1.23,11,3,0.62],[210.8,144.1,-4.7,1.58,7,2,0.59],[226.7,149.5,9.5,1.26,9,0,0.95],[245.8,144.5,-3.6,1.17,6,0,0.82],[266.0,149.4,-14.1,1.41,8,2,0.66],[286.8,152.0,-1.4,1.72,12,1,0.83],[297.6,150.4,5.1,1.1,2,1,0.96],[317.8,149.1,11.4,1.6,12,3,0.72],[42.3,163.3,3.9,1.66,8,0,0.93],[60.3,168.7,6.9,1.11,7,0,0.95],[77.4,162.9,-2.9,1.04,8,1,0.89],[90.5,165.7,-0.3,1.07,9,3,0.54],[114.9,162.1,-1.2,1.62,7,3,0.65],[129.0,165.4,-15.3,1.72,0,2,0.64],[223.9,169.0,-10.7,1.23,5,3,0.67],[235.5,167.7,17.0,1.05,0,0,0.96],[255.2,166.4,2.7,1.27,0,3,0.57],[270.4,168.6,9.6,1.33,8,0,0.96],[292.9,166.9,7.1,1.45,10,0,0.84],[311.1,167.0,5.9,1.09,1,0,0.88],[331.3,167.2,11.6,1.25,4,2,0.62],[32.5,181.0,-14.8,1.72,0,0,0.83],[47.2,184.6,8.8,1.31,11,0,0.87],[68.7,186.8,-15.0,1.53,4,3,0.6],[88.3,180.4,-15.8,0.98,4,0,0.88],[104.8,181.3,-0.5,1.64,9,0,0.86],[122.8,183.8,16.8,1.08,10,0,0.87],[136.3,186.4,10.0,1.33,12,3,0.71],[231.5,186.9,-8.1,1.41,1,3,0.58],[247.3,183.9,10.4,1.26,0,1,0.86],[266.4,183.7,-8.8,1.12,7,0,0.96],[283.3,184.3,-15.7,1.23,4,3,0.63],[304.1,184.2,3.2,1.33,1,1,0.84],[316.4,185.6,2.3,1.24,2,3,0.67],[43.7,200.1,5.1,1.4,2,3,0.54],[57.0,199.9,-11.8,1.53,0,2,0.71],[79.2,205.2,-16.3,1.62,2,3,0.51],[92.5,198.0,8.9,1.11,1,3,0.67],[111.8,201.0,-4.5,1.26,3,3,0.54],[132.5,205.3,-1.2,1.66,2,1,0.96],[151.4,199.8,13.2,1.7,1,1,0.96],[241.2,198.9,-16.0,1.73,4,1,0.91],[253.0,204.0,-2.4,1.73,3,2,0.72],[270.8,200.3,-15.9,1.67,10,2,0.53],[288.1,204.5,-13.0,1.22,8,0,0.96],[308.3,200.9,-3.3,0.98,2,2,0.63],[330.7,202.2,-11.7,1.13,9,0,0.97],[46.0,221.7,13.2,1.6,6,2,0.67],[67.6,223.2,-14.1,1.18,0,3,0.6],[85.2,220.3,16.8,0.97,2,1,0.92],[99.8,218.0,-16.9,1.6,11,0,0.99],[118.6,216.1,2.8,1.43,1,1,0.94],[137.8,216.8,-8.2,1.09,8,3,0.61],[159.1,216.9,13.8,1.05,2,1,0.97],[176.4,219.7,16.1,1.27,6,0,0.99],[194.6,220.8,-16.7,1.43,5,0,0.96],[210.2,222.7,12.3,1.52,8,2,0.68],[225.4,220.1,15.6,1.72,10,1,0.97],[248.1,218.9,-15.5,1.37,10,3,0.54],[261.2,217.1,10.0,1.73,12,3,0.64],[286.8,223.8,13.2,0.98,9,2,0.7],[299.2,220.3,4.4,1.69,0,2,0.53],[318.5,223.6,-7.0,1.18,9,1,0.82],[340.7,223.4,-15.0,1.67,8,1,0.89],[352.1,218.3,-7.6,1.28,11,1,0.95],[373.4,222.7,2.5,1.44,11,3,0.54],[38.4,240.2,-15.6,1.08,0,2,0.6],[58.1,240.7,9.5,1.23,10,1,1.0],[77.9,235.2,-5.3,1.22,4,1,0.92],[96.6,238.1,8.8,1.54,10,3,0.56],[113.7,241.3,13.3,1.05,8,0,0.88],[130.7,238.0,2.6,1.72,4,3,0.69],[151.0,238.9,-1.7,1.25,5,3,0.56],[164.3,237.1,-4.2,1.39,11,2,0.5],[186.8,238.0,-11.4,1.31,6,2,0.68],[202.6,238.7,15.1,1.02,9,2,0.71],[222.7,241.7,-2.6,1.11,4,0,0.81],[238.5,238.0,9.8,1.69,8,3,0.61],[257.8,237.4,-16.5,1.32,0,2,0.6],[275.4,238.2,-4.5,1.03,9,3,0.64],[289.2,235.5,-3.5,1.29,11,2,0.65],[312.5,235.4,17.2,1.2,1,2,0.61],[329.2,236.4,15.7,1.22,8,3,0.64],[344.3,238.1,-11.2,1.35,9,1,0.81],[364.8,236.8,4.9,1.74,0,0,0.94],[49.1,252.2,16.1,1.01,9,3,0.68],[66.4,258.4,6.6,1.47,3,2,0.53],[83.8,253.4,-14.4,1.16,7,0,0.87],[104.0,252.2,-3.7,1.13,9,0,0.89],[118.9,253.8,3.1,1.08,7,1,0.86],[137.4,256.8,-0.2,1.72,6,0,0.85],[158.4,256.7,-3.7,1.28,3,3,0.5],[171.7,253.4,-17.7,1.25,5,2,0.59],[189.9,256.3,-3.5,1.26,6,0,0.99],[213.6,254.8,-11.1,1.15,6,2,0.58],[225.3,257.3,-12.4,1.22,4,1,0.82],[247.4,258.3,-1.2,1.39,5,1,0.83],[262.7,255.2,2.9,1.45,8,2,0.71],[280.6,258.9,15.9,1.49,7,2,0.63],[301.7,254.9,3.9,1.15,12,1,0.83],[316.0,256.1,-8.3,1.38,11,3,0.51],[337.5,254.5,-14.9,1.26,3,1,0.96],[353.6,257.3,2.2,1.04,12,2,0.68],[371.4,252.5,-9.8,1.2,6,1,0.96],[57.4,276.1,8.6,1.07,2,2,0.64],[76.5,271.8,0.7,1.35,9,3,0.65],[92.8,270.0,10.0,1.62,9,2,0.7],[112.9,270.4,-14.0,1.15,5,2,0.55],[132.0,270.7,-3.8,1.51,1,1,0.86],[146.8,277.6,-5.7,1.3,10,3,0.61],[167.6,273.4,15.4,1.36,3,1,0.9],[180.3,275.6,-8.6,1.59,10,1,0.99],[199.9,272.1,-12.0,1.72,3,2,0.59],[221.1,271.1,-0.5,1.5,3,3,0.55],[234.0,275.5,5.1,1.06,11,2,0.53],[253.1,274.5,11.4,1.22,2,3,0.67],[275.4,271.2,12.2,1.73,1,3,0.68],[293.5,270.1,-16.4,1.34,1,2,0.57],[311.6,273.6,-6.3,1.04,4,3,0.63],[325.3,270.6,17.7,0.96,11,3,0.52],[344.7,275.9,5.2,1.16,12,3,0.61],[364.3,270.1,5.2,1.69,1,2,0.64],[82.3,291.5,-14.8,1.73,7,0,0.97],[100.5,293.8,12.3,0.95,1,3,0.53],[122.3,292.1,-5.8,1.29,2,3,0.5],[142.2,289.3,-2.0,1.19,7,2,0.62],[153.7,290.6,17.0,1.32,9,1,0.99],[176.0,294.5,6.4,1.0,6,2,0.62],[196.6,291.8,-7.2,1.47,10,2,0.62],[207.2,289.5,-1.9,1.49,9,0,0.83],[228.0,292.6,1.1,1.28,1,3,0.59],[244.8,295.7,9.0,1.11,4,1,0.97],[266.2,289.5,7.5,1.49,3,1,0.91],[283.3,293.6,14.7,1.54,10,0,0.97],[297.6,291.5,1.8,1.64,11,0,0.93],[319.1,291.7,1.6,1.5,12,1,0.91],[333.7,291.0,-3.4,1.45,0,0,0.87],[234.8,312.3,-9.4,1.58,4,1,0.94],[259.7,308.7,12.7,1.24,8,1,0.87],[275.7,308.7,6.2,1.51,3,3,0.61],[294.5,314.0,-10.6,1.07,6,3,0.59],[310.5,308.4,-15.6,1.09,4,2,0.66],[229.0,328.4,15.8,1.1,2,2,0.66],[250.0,330.8,1.0,1.57,3,2,0.67],[264.5,330.9,14.8,1.12,5,3,0.6],[285.3,324.2,-17.4,1.48,5,3,0.65],[297.5,328.5,15.1,1.28,0,1,0.81],[221.5,347.8,11.7,1.74,9,0,0.82],[240.3,349.3,7.0,0.99,7,2,0.65],[256.4,344.5,-18.0,1.73,9,3,0.61],[274.4,345.0,10.5,1.61,1,3,0.58],[225.7,366.8,-17.4,1.41,12,3,0.52],[244.7,363.6,-10.8,1.61,0,2,0.61],[265.4,366.0,-13.0,1.62,10,3,0.68]];
  var PATHS = ["m143.08 211.84h29.629v79.031h-58.867q-35.087 0-54.969-20.977-19.882-20.983-19.882-57.647v-72.921h-38.985v-22.406l104.87-116.92h18.713v70.884h47.952v68.439h-45.223v54.996q0 7.7402 4.4859 12.629 4.4807 4.8885 12.278 4.8885z", "m214.95 148.93h-30.037v-78.746h59.679q35.57 0 55.727 20.901 20.156 20.907 20.156 57.438v72.657h39.522v22.325l-106.32 116.5h-18.971v-70.628h-48.613v-68.192h45.846v-54.797q0-7.7122-4.5477-12.583-4.5425-4.8708-12.447-4.8708z"];
  var PAL = ['#4f4b63', '#f04f26', '#8783a0', '#ff9470'];
  var CHIPS = ['+1 lead', '+1 conversion', 'ROAS 4.2x', 'CPL -84%', '+37 inquiries', 'Tracked to revenue'];

  // ==================================================================
  // CONFIG: tweak the animation here. Values are read every frame, so from the browser console you can
  // also edit them live, e.g. analyttHero.config.gather.startMin = 40. Timing values (introDuration,
  // duration, delay, ease) apply the next time you call analyttHero.replay().
  // Distances are in logo units: the logo is 360 wide, so its corners are about 255 from the centre.
  // ==================================================================
  var CONFIG = {
    gather: {
      startMin: 70,        // closest an icon can start from the logo centre
      startSpread: 110,    // random extra distance on top of startMin (so icons start 70 to 180 away)
      startDepth: 120,     // how far icons scatter toward / away from the camera (z)
      swirl: 1.8,          // radians of spiral rotation while travelling in
      spin: 9,             // radians of per-icon spin while travelling in
      drift: 10,           // idle wobble of the cloud before it gathers
      span: .45,           // share of the timeline each icon spends travelling (higher = less stagger)
      jitter: .3,          // 0 = strict spiral order, 1 = fully random order (per-icon stagger)
      fadeIn: .3,          // share of each icon's own travel spent fading from 0 to full opacity
      introDuration: 0.2,  // seconds for the ambient side icons to fade in
      delay: 0,           // seconds before the first icon starts
      duration: 1.8,       // seconds for the whole gather, first icon to last
      ease: 'power1.inOut'
    },
    pointer: { radius: 62, push: 36, lift: 46 },
    splash:  { radius: 105, power: 1 },
    bubbles: { opacity: 1 },   // ambient icons drifting up the sides (0 hides them)
    parallax: 1,               // 3D tilt with the cursor (0 = flat)
    logo: {
      scale: .55,              // overall logo size, silhouette AND icons together (1 = original, .75 = 25% smaller)
      scaleMobile: .75,        // same, but for screens narrower than 1080px
      offsetX: 0,              // nudge the logo horizontally, in px (+ = right)
      offsetY: 0               // nudge the logo vertically, in px (+ = down)
    }
  };

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = heroEl;
  var canvas = canvasEl;
  var hasGsap = !!gsap;

  function hexRGB(h){ return [parseInt(h.slice(1,3),16)/255, parseInt(h.slice(3,5),16)/255, parseInt(h.slice(5,7),16)/255]; }

  // ------------------------------------------------------------------
  // Three.js scene
  // ------------------------------------------------------------------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    hero.classList.add('no-gl');
    return;
  }
  renderer.setClearColor(0x000000, 0);

  var FOV = 35;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(FOV, 1, 10, 6000);
  var group = new THREE.Group();
  scene.add(group);

  // ---- icon atlas (4x4 cells, 128px each), drawn white so the shader can tint it ----
  var CELL = 128, K = 5.2;
  function rr(g, x, y, w, h, r){
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
    g.fill();
  }
  function P(g, d, a){ g.globalAlpha = a == null ? 1 : a; g.fill(new Path2D(d)); g.globalAlpha = 1; }
  function L(g, pts){ g.beginPath(); g.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i+1]); g.stroke(); }
  function C(g, x, y, r, a){ g.globalAlpha = a == null ? 1 : a; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
  function cut(g, fn){ g.save(); g.globalCompositeOperation = 'destination-out'; fn(); g.restore(); }

  var ICONS = [
    function megaphone(g){ P(g,'M-9,-3 L-1,-7 L7,-9 L7,9 L-1,7 L-9,3 Z'); rr(g,-10,-3,2.2,6,1); P(g,'M-3,7.5 L0,9.5 L1,6.5 L-2,5 Z'); },
    function chart(g){ rr(g,-8,0,3.2,8,.6); rr(g,-3,-4,3.2,12,.6); rr(g,2,-8,3.2,16,.6); },
    function heart(g){ P(g,'M0,8 C-6,3 -9,-1 -9,-4.5 C-9,-7.5 -6.8,-9.5 -4.2,-9.5 C-2.3,-9.5 -0.8,-8.3 0,-6.7 C0.8,-8.3 2.3,-9.5 4.2,-9.5 C6.8,-9.5 9,-7.5 9,-4.5 C9,-1 6,3 0,8 Z'); },
    function cursor(g){ P(g,'M-7,-9 L6,-1.5 L0.5,0.5 L4,8.5 L0.8,10 L-2.7,2 L-7,5.5 Z'); },
    function play(g){ C(g,0,0,9.5,.28); P(g,'M-3.2,-5.6 L6.4,0 L-3.2,5.6 Z'); },
    function chat(g){ rr(g,-9,-7,18,12,4); P(g,'M-4,5 L-6,10 L0,5.5 Z'); },
    function phone(g){ rr(g,-5.5,-10,11,20,2.4); cut(g,function(){ rr(g,-3.6,-6.5,7.2,4,.8); C(g,0,6.8,1.3); }); },
    function envelope(g){ rr(g,-10,-6.5,20,13,1.6); cut(g,function(){ g.lineWidth = 1.6; L(g,[-10,-6.5,0,1,10,-6.5]); }); },
    function hashtag(g){ g.lineWidth = 2; L(g,[-7,-8,-9.5,8]); L(g,[1,-8,-1.5,8]); L(g,[-9.5,-2.5,2,-2.5]); L(g,[-10.5,3,1,3]); },
    function target(g){ g.lineWidth = 1.8; g.beginPath(); g.arc(0,0,9,0,Math.PI*2); g.stroke(); g.beginPath(); g.arc(0,0,5.2,0,Math.PI*2); g.stroke(); C(g,0,0,1.4); },
    function bell(g){ P(g,'M0,-9 C4.5,-9 6.5,-5.7 6.5,-1.8 L6.5,3.5 L9,6.5 L-9,6.5 L-6.5,3.5 L-6.5,-1.8 C-6.5,-5.7 -4.5,-9 0,-9 Z'); C(g,0,9,2.1); },
    function share(g){ C(g,-7,-6,2.3); C(g,-7,6,2.3); C(g,7,0,2.6); g.lineWidth = 1.6; g.globalAlpha = .8; L(g,[-7,-6,7,0]); L(g,[-7,6,7,0]); g.globalAlpha = 1; },
    function thumb(g){ P(g,'M-7,-1 L-4,-1 L-4,9 L-7,9 Z'); P(g,'M-3,-1 L2.5,-9 C4,-9.5 5.3,-8.2 4.8,-6.7 L3.2,-1.5 L8,-1.5 C9.4,-1.5 10.3,0 9.6,1.2 L6.3,8 C5.9,8.8 5,9.3 4.1,9.3 L-3,9.3 Z'); }
  ];

  function buildAtlas(){
    var cv = document.createElement('canvas');
    cv.width = cv.height = CELL * 4;
    var g = cv.getContext('2d');
    ICONS.forEach(function(fn, i){
      g.save();
      g.translate((i % 4) * CELL + CELL / 2, Math.floor(i / 4) * CELL + CELL / 2);
      g.scale(K, K);
      g.fillStyle = '#fff'; g.strokeStyle = '#fff';
      fn(g);
      g.restore();
    });
    var t = new THREE.CanvasTexture(cv);
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 4;
    return t;
  }

  // ---- logo silhouette mask: icons are clipped to this once they settle ----
  var maskCv = document.createElement('canvas');
  maskCv.width = maskCv.height = 512;
  var mg = maskCv.getContext('2d');
  mg.scale(512 / 360, 512 / 360);
  mg.fillStyle = '#fff';
  PATHS.forEach(function(d){ mg.fill(new Path2D(d)); });
  var maskTex = new THREE.CanvasTexture(maskCv);
  maskTex.minFilter = THREE.LinearFilter; maskTex.generateMipmaps = false;

  // ---- instanced icons ----
  var AMBIENT = 40;
  var N = TILES.length + AMBIENT;
  var aTarget = new Float32Array(N * 3);
  var aParam  = new Float32Array(N * 4);
  var aSeed   = new Float32Array(N * 4);
  var aColor  = new Float32Array(N * 3);
  var aMeta   = new Float32Array(N * 2);

  function rnd(){ return Math.random(); }
  function put(i, x, y, z, rot, sc, type, ci, alpha, delay, clip){
    aTarget[i*3] = x; aTarget[i*3+1] = y; aTarget[i*3+2] = z;
    aParam[i*4] = rot; aParam[i*4+1] = sc; aParam[i*4+2] = type; aParam[i*4+3] = alpha;
    aSeed[i*4] = rnd(); aSeed[i*4+1] = rnd(); aSeed[i*4+2] = rnd(); aSeed[i*4+3] = rnd();
    var c = hexRGB(PAL[ci]);
    aColor[i*3] = c[0]; aColor[i*3+1] = c[1]; aColor[i*3+2] = c[2];
    aMeta[i*2] = delay; aMeta[i*2+1] = clip;
  }
  var order = new Float32Array(TILES.length);
  TILES.forEach(function(t, i){
    var x = t[0] - 180, y = 180 - t[1];
    // gather order: a spiral from the centre outward
    var r = Math.min(1, Math.sqrt(x*x + y*y) / 255);
    var a = (Math.atan2(y, x) + Math.PI) / (Math.PI * 2);
    order[i] = .6 * r + .4 * a;
    put(i, x, y, (rnd() - .5) * 70, -t[2] * Math.PI / 180, t[3], t[4], t[5], t[6], order[i], 1);
  });
  // ambient "ad bubbles" that drift upward on both sides of the mark
  for (var k = 0; k < AMBIENT; k++){
    var side = rnd() < .5 ? -1 : 1;
    var ci = [0, 1, 2, 3, 2, 3][Math.floor(rnd() * 6)];
    put(TILES.length + k, side * (205 + rnd() * 190), 0, (rnd() - .5) * 220,
        (rnd() - .5) * 1.2, .9 + rnd() * 1.4, Math.floor(rnd() * 13), ci, .25 + rnd() * .3, 0, 0);
  }

  // stagger: blend the spiral order with randomness. Re-rolled on every replay().
  function applyStagger(){
    var J = Math.max(0, Math.min(1, CONFIG.gather.jitter));
    for (var i = 0; i < TILES.length; i++){
      aMeta[i*2] = Math.max(0, Math.min(1, order[i] * (1 - J) + rnd() * J));
    }
    if (geo && geo.attributes && geo.attributes.aMeta) geo.attributes.aMeta.needsUpdate = true;
  }
  var geo = null;
  var base = new THREE.PlaneGeometry(1, 1);
  geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.attributes.position);
  geo.setAttribute('uv', base.attributes.uv);
  geo.instanceCount = N;
  geo.setAttribute('aTarget', new THREE.InstancedBufferAttribute(aTarget, 3));
  geo.setAttribute('aParam',  new THREE.InstancedBufferAttribute(aParam, 4));
  geo.setAttribute('aSeed',   new THREE.InstancedBufferAttribute(aSeed, 4));
  geo.setAttribute('aColor',  new THREE.InstancedBufferAttribute(aColor, 3));
  geo.setAttribute('aMeta',   new THREE.InstancedBufferAttribute(aMeta, 2));

  var U = {
    uProgress: { value: reduce ? 1 : 0 },   // 0 = scattered cloud, 1 = silhouette formed
    uIntro:    { value: reduce ? 1 : 0 },   // fades in the ambient side icons
    uTime:     { value: 0 },
    uMotion:   { value: reduce ? 0 : 1 },
    uMouse:    { value: new THREE.Vector2(9999, 9999) },
    uMouseOn:  { value: 0 },
    uHotR:     { value: CONFIG.pointer.radius },
    uPush:     { value: CONFIG.pointer.push },
    uLift:     { value: CONFIG.pointer.lift },
    uSplashR:  { value: CONFIG.splash.radius },
    uSplashP:  { value: CONFIG.splash.power },
    uBubbles:  { value: CONFIG.bubbles.opacity },
    uStartMin: { value: CONFIG.gather.startMin },
    uStartSpr: { value: CONFIG.gather.startSpread },
    uStartZ:   { value: CONFIG.gather.startDepth },
    uSwirl:    { value: CONFIG.gather.swirl },
    uSpin:     { value: CONFIG.gather.spin },
    uDrift:    { value: CONFIG.gather.drift },
    uSpan:     { value: CONFIG.gather.span },
    uFade:     { value: CONFIG.gather.fadeIn },
    uClick:    { value: new THREE.Vector4(0, 0, 9, 0) },
    uQuad:     { value: CELL / K },
    uAtlas:    { value: buildAtlas() },
    uMask:     { value: maskTex }
  };

  var vert = [
    'precision highp float;',
    'attribute vec3 aTarget; attribute vec4 aParam; attribute vec4 aSeed; attribute vec3 aColor; attribute vec2 aMeta;',
    'uniform float uProgress; uniform float uIntro; uniform float uTime; uniform float uMotion; uniform float uMouseOn; uniform float uHotR; uniform float uQuad;',
    'uniform float uPush; uniform float uLift; uniform float uSplashR; uniform float uSplashP; uniform float uBubbles;',
    'uniform float uStartMin; uniform float uStartSpr; uniform float uStartZ; uniform float uSwirl; uniform float uSpin; uniform float uDrift; uniform float uSpan; uniform float uFade;',
    'uniform vec2 uMouse; uniform vec4 uClick;',
    'varying vec2 vUv; varying vec3 vColor; varying float vAlpha; varying float vType; varying float vClip; varying vec2 vMaskPos;',
    'vec2 rot2(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c*p.x - s*p.y, s*p.x + c*p.y); }',
    'float easeOutCubic(float t){ return 1. - pow(1. - t, 3.); }',
    'float easeOutBack(float t){ float c1 = 1.6; float c3 = c1 + 1.; float x = t - 1.; return 1. + c3*x*x*x + c1*x*x; }',
    'void main(){',
    '  float isClip = aMeta.y;',
    '  float tt = uTime * uMotion;',
    '  vec3 pos; float rot = aParam.x; float scl = aParam.y; float alpha = aParam.w;',
    '  float hot = 0.; float free = 0.; float local = 1.;',
    // staggered pop-in of the scattered cloud
    '  if (isClip > .5) {',
    // gather: each icon leaves the cloud on its own delay and spirals into its place in the silhouette
    '    float span = uSpan;',
    '    local = clamp((uProgress - aMeta.x * (1. - span)) / span, 0., 1.);',
    '    float ep = easeOutCubic(local);',
    '    float es = max(easeOutBack(local), 0.);',
    '    float ang = aSeed.x * 6.2831853;',
    '    float rad = uStartMin + aSeed.y * uStartSpr;',
    '    vec3 start = vec3(cos(ang) * rad, sin(ang) * rad, (aSeed.z - .5) * uStartZ);',
    '    start.xy += vec2(sin(tt*.5 + aSeed.w*20.), cos(tt*.45 + aSeed.z*20.)) * uDrift;',
    '    vec3 rest = aTarget + vec3(cos(tt*.9 + aSeed.y*20.) * 1.8, sin(tt*1.2 + aSeed.x*20.) * 2.6, sin(tt*.5 + aSeed.z*20.) * 5.) * ep;',
    '    pos = mix(start, rest, ep);',
    '    pos.xy = rot2(pos.xy, (1. - ep) * (aSeed.w - .5) * uSwirl);',
    '    rot += (1. - ep) * (aSeed.z - .5) * uSpin + sin(tt*.8 + aSeed.z*20.) * .1 * ep;',
    // pointer: icons near the cursor are pushed away, lifted and lit up
    '    vec2 dm = pos.xy - uMouse; float dist = length(dm);',
    '    float f = (1. - smoothstep(0., uHotR, dist)) * uMouseOn * ep;',
    '    pos.xy += dm / (dist + .001) * f * uPush * uMotion;',
    '    pos.z += f * uLift * uMotion;',
    '    hot += f;',
    // click splash: icons near the click leap out on a ballistic arc, then land back in the silhouette
    '    vec2 dc = aTarget.xy - uClick.xy; float dcl = length(dc);',
    '    float sw = (1. - smoothstep(0., uSplashR, dcl)) * uClick.w * uMotion * uSplashP * step(.99, ep);',
    '    vec2 vel = vec2((aSeed.x - .5) * 230. + dc.x * 1.4, 240. + aSeed.y * 200.) * sw;',
    '    float Ti = 2. * vel.y / 640.;',
    '    float tau = uClick.z - dcl * .0022 - aSeed.z * .07;',
    '    float act = step(0., tau) * (1. - step(Ti, tau)) * step(.05, Ti);',
    '    pos.xy += vec2(vel.x * tau, vel.y * tau - 320. * tau * tau) * act;',
    '    rot += act * tau * 7. * sign(aSeed.w - .5);',
    '    hot += act * .6;',
    '    free = act;',
    '    scl *= mix(.35, 1., es) * (1. + min(hot, 1.) * .3);',
    '    alpha *= smoothstep(0., max(uFade, .001), local);',
    '  } else {',
    // ambient bubbles drifting up past the mark
    '    float prog = fract(aSeed.y + uTime * uMotion * (.02 + aSeed.z * .03));',
    '    pos = aTarget;',
    '    pos.y = -330. + prog * 660.;',
    '    pos.x += sin(prog * 9. + aSeed.w * 6.28318) * 14.;',
    '    alpha *= sin(prog * 3.14159) * uIntro * uBubbles;',
    '    scl *= .85 + .3 * sin(prog * 6. + aSeed.x * 6.28318);',
    '  }',
    '  hot = clamp(hot, 0., 1.);',
    '  vec2 q = rot2(position.xy * uQuad * scl, rot);',
    '  vMaskPos = aTarget.xy + q;',
    '  vec3 accent = vec3(.941, .31, .149); vec3 ink = vec3(.165, .153, .208);',
    '  vColor = mix(aColor, mix(accent, ink, step(.8, aColor.r)), hot);',
    '  vAlpha = min(1., alpha + hot * .4);',
    '  vClip = isClip * smoothstep(.7, 1., local) * (1. - free);',
    '  vType = aParam.z; vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xy + q, pos.z, 1.);',
    '}'
  ].join('\n');

  var frag = [
    'precision highp float;',
    'uniform sampler2D uAtlas; uniform sampler2D uMask;',
    'varying vec2 vUv; varying vec3 vColor; varying float vAlpha; varying float vType; varying float vClip; varying vec2 vMaskPos;',
    'void main(){',
    '  float col = mod(vType, 4.); float row = floor(vType / 4.);',
    '  vec2 uv = vec2((col + vUv.x) / 4., 1. - (row + 1.) / 4. + vUv.y / 4.);',
    '  float a = texture2D(uAtlas, uv).a;',
    '  float m = texture2D(uMask, vMaskPos / 360. + .5).a;',
    '  a *= mix(1., m, vClip);',
    '  a *= vAlpha;',
    '  if (a < .01) discard;',
    '  gl_FragColor = vec4(vColor, a);',
    '}'
  ].join('\n');

  var icons = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms: U, vertexShader: vert, fragmentShader: frag,
    transparent: true, depthWrite: false, depthTest: false
  }));
  icons.frustumCulled = false;
  group.add(icons);

  // ------------------------------------------------------------------
  // Layout: 1 world unit = 1 CSS px at z = 0; logo sits right on desktop, on top on mobile
  // ------------------------------------------------------------------
  var W = 1, H = 1, gScale = 1;
  function layout(){
    var desk = W >= 1080, size, cx, cy;
    if (desk){
      size = Math.min(H * .78, W * .42) * CONFIG.logo.scale;
      cx = W * .725; cy = H * .5 + 14;
    } else {
      size = Math.min(W * .8, H * .38) * CONFIG.logo.scaleMobile;
      cy = 84 + Math.min(W * .8, H * .38) / 2; cx = W / 2;
    }
    cx += CONFIG.logo.offsetX; cy += CONFIG.logo.offsetY;
    gScale = size / 360;
    group.scale.setScalar(gScale);
    group.position.set(cx - W / 2, H / 2 - cy, 0);
  }
  // Pixel budget: never above min(dpr, 2), stepping down adaptively
  // while the average frame stays over ~29ms.
  var baseZ = 1, prStep = 0;
  var PR_STEPS = [2, 1.5, 1.25, 1];
  function currentPR(){ return Math.min(window.devicePixelRatio || 1, PR_STEPS[prStep]); }
  function resize(){
    var r = hero.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(currentPR());
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.z = (H / 2) / Math.tan(FOV * Math.PI / 360);
    baseZ = camera.position.z;
    camera.far = camera.position.z * 3 + 3000;
    camera.updateProjectionMatrix();
    layout();
  }
  resize();
  var ro = null;
  if (window.ResizeObserver){ ro = new ResizeObserver(resize); ro.observe(hero); }
  else window.addEventListener('resize', resize);

  // ------------------------------------------------------------------
  // Pointer interaction
  // ------------------------------------------------------------------
  var ptr = { px: 0, py: 0, sx: 9999, sy: 9999, on: 0, target: 0, nx: 0, ny: 0, seen: false };
  function toLocal(px, py){
    return [(px - W / 2 - group.position.x) / gScale, (H / 2 - py - group.position.y) / gScale];
  }
  function onMove(e){
    var r = hero.getBoundingClientRect();
    ptr.px = e.clientX - r.left; ptr.py = e.clientY - r.top;
    ptr.nx = ptr.px / W * 2 - 1; ptr.ny = ptr.py / H * 2 - 1;
    ptr.target = 1;
    if (!ptr.seen){ var l = toLocal(ptr.px, ptr.py); ptr.sx = l[0]; ptr.sy = l[1]; ptr.seen = true; }
  }
  var clickT0 = -10, chipI = 0;
  function splash(e){
    if (getP() > 0.79) return; // parked: the portal owns the stage now
    if (e.target.closest && e.target.closest('a,button')) return;
    onMove(e);
    var l = toLocal(ptr.px, ptr.py);
    U.uClick.value.set(l[0], l[1], 0, 1);
    clickT0 = performance.now();
    if (reduce || !hasGsap) return;

    var ring = document.createElement('div');
    ring.className = 'pointer-events-none absolute z-20 rounded-full border-[1.5px] border-accent';
    var D = 2 * 210 * gScale;
    ring.style.cssText = 'left:' + ptr.px + 'px;top:' + ptr.py + 'px;width:' + D + 'px;height:' + D + 'px;';
    hero.appendChild(ring);
    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0, opacity: .5 });
    gsap.to(ring, { scale: 1, duration: .9, ease: 'power2.out' });
    gsap.to(ring, { opacity: 0, duration: .9, ease: 'power2.in', onComplete: function(){ ring.remove(); } });

    var chip = document.createElement('div');
    chip.className = 'pointer-events-none absolute z-40 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-primary/20 bg-white px-[13px] py-[7px] text-[.78rem] font-semibold text-primary shadow-[0_8px_24px_-10px_rgba(42,39,53,.35)]';
    chip.innerHTML = '<span class="h-[7px] w-[7px] rounded-full bg-accent"></span>' + CHIPS[chipI++ % CHIPS.length];
    chip.style.left = ptr.px + 'px'; chip.style.top = (ptr.py - 28) + 'px';
    hero.appendChild(chip);
    gsap.fromTo(chip, { xPercent: -50, yPercent: -50, y: 0, opacity: 0, scale: .8 }, { y: -26, opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.2)' });
    gsap.to(chip, { y: -78, opacity: 0, duration: .7, delay: .85, ease: 'power2.in', onComplete: function(){ chip.remove(); } });
  }
  function onLeave(){ ptr.target = 0; }
  function onUp(e){ if (e.pointerType === 'touch') ptr.target = 0; }
  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerdown', splash);
  hero.addEventListener('pointerleave', onLeave);
  hero.addEventListener('pointerup', onUp);
  hero.addEventListener('pointercancel', onLeave);

  // ------------------------------------------------------------------
  // Intro: icons pop into a scattered cloud, then gather into the logo silhouette
  // ------------------------------------------------------------------
  var counters = [].slice.call(heroEl.querySelectorAll('[data-to]'));
  function setCounters(p){
    counters.forEach(function(el){
      el.textContent = (el.getAttribute('data-pre') || '') + Math.round(parseFloat(el.getAttribute('data-to')) * p) + (el.getAttribute('data-suf') || '');
    });
  }
  var tl = null, introDone = false;
  function play(){
    if (tl) tl.kill();
    // Scroll takes over uProgress only once the intro lands, so the tween
    // and the scrub never fight over the same uniform.
    introDone = false;
    var G = CONFIG.gather;
    applyStagger();
    if (reduce || !hasGsap){
      U.uIntro.value = 1; U.uProgress.value = 1; setCounters(1);
      introDone = true;
      return;
    }
    U.uIntro.value = 0; U.uProgress.value = 0; setCounters(0);
    tl = gsap.timeline();
    tl.to(U.uIntro, { value: 1, duration: G.introDuration, ease: 'none' }, .2 + G.delay)
      .to(U.uProgress, { value: 1, duration: G.duration, ease: G.ease,
                         onUpdate: function(){ setCounters(U.uProgress.value); },
                         onComplete: function(){ setCounters(1); introDone = true; } }, .2 + G.delay);
  }
  play();
  window.analyttHero = { config: CONFIG, replay: play };

  // ------------------------------------------------------------------
  // Render loop — reads scroll progress imperatively, draws nothing once
  // the portal covers the stage, and pauses entirely off-screen.
  // ------------------------------------------------------------------
  var clock = new THREE.Clock(), time = 0;
  var tiltX = 0, tiltY = 0;
  var rafId = 0, running = true, inView = true, disposed = false;
  var emaMs = 16, drawn = 0;

  var io = null;
  if (window.IntersectionObserver){
    io = new IntersectionObserver(function(entries){ inView = entries[0].isIntersecting; }, { rootMargin: '100px' });
    io.observe(hero);
  }
  function onContextLost(e){ if (e) e.preventDefault(); hero.classList.add('no-gl'); running = false; if (rafId) cancelAnimationFrame(rafId); }
  canvas.addEventListener('webglcontextlost', onContextLost);

  function tick(){
    if (disposed) return;
    rafId = requestAnimationFrame(tick);
    var dt = Math.min(clock.getDelta(), .06);
    if (!running || !inView) return;
    var p = getP();
    if (p > 0.65) return; // flood circle done (PORTAL_RANGE ends at 0.6):
    // the opaque flood covers the stage, so hold the frame, draw nothing
    var cost0 = performance.now();
    time += dt;
    U.uTime.value = time;
    var m = reduce ? 0 : 1;

    var G = CONFIG.gather;
    U.uStartMin.value = G.startMin; U.uStartSpr.value = G.startSpread; U.uStartZ.value = G.startDepth;
    U.uSwirl.value = G.swirl; U.uSpin.value = G.spin; U.uDrift.value = G.drift; U.uSpan.value = G.span;
    U.uHotR.value = CONFIG.pointer.radius; U.uLift.value = CONFIG.pointer.lift;
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
    ptr.sx += (l[0] - ptr.sx) * .22; ptr.sy += (l[1] - ptr.sy) * .22;
    ptr.on += ((parked ? 0 : ptr.target) - ptr.on) * .1;
    U.uMouse.value.set(ptr.sx, ptr.sy);
    U.uMouseOn.value = ptr.on;

    // re-apply logo size/offset if edited live from the console
    var LG = CONFIG.logo, lk = LG.scale + '|' + LG.scaleMobile + '|' + LG.offsetX + '|' + LG.offsetY;
    if (lk !== tick._lk){ tick._lk = lk; layout(); }

    var click = (performance.now() - clickT0) / 1000;
    U.uClick.value.z = click;
    if (click > 2.8) U.uClick.value.w = 0;

    // gentle 3D parallax, damped toward its targets
    var pm = m * CONFIG.parallax * (1 - closeT);
    var txT = (-ptr.ny * .16 + Math.sin(time * .35) * .03) * pm;
    var tyT = ( ptr.nx * .24 + Math.cos(time * .3) * .04) * pm;
    tiltX += (txT - tiltX) * k; tiltY += (tyT - tiltY) * k;
    group.rotation.x = tiltX; group.rotation.y = tiltY;

    renderer.render(scene, camera);

    // Adaptive pixel ratio: while the average frame stays over ~29ms,
    // step down the ladder. Never steps back up mid-visit.
    var cost = performance.now() - cost0;
    emaMs += (cost - emaMs) * 0.05;
    drawn += 1;
    if (drawn % 120 === 0 && emaMs > 29 && prStep < PR_STEPS.length - 1){
      prStep += 1;
      renderer.setPixelRatio(currentPR());
    }
  }
  tick();

  return function(){
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (tl) tl.kill();
    if (io) io.disconnect();
    if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerdown', splash);
    hero.removeEventListener('pointerleave', onLeave);
    hero.removeEventListener('pointerup', onUp);
    hero.removeEventListener('pointercancel', onLeave);
    if (renderer) renderer.dispose();
    if (window.analyttHero && window.analyttHero.replay === play) delete window.analyttHero;
  };
}
