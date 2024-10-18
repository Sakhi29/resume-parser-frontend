"use client";
import React, { useRef, useState, useEffect } from "react";
import swal from "sweetalert";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

const WebCamera = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [prevEyePositions, setPrevEyePositions] = useState({
    leftEye: { x: null as number | null, y: null as number | null },
    rightEye: { x: null as number | null, y: null as number | null },
  });

  // Load posenet
  const runPosenet = async () => {
    // Initialize TensorFlow.js backend
    await tf.setBackend("webgl");
    await tf.ready();

    const net = await posenet.load({
      architecture: "ResNet50",
      quantBytes: 2,
      inputResolution: { width: 640, height: 480 },
      outputStride: 32, // Add the outputStride property
    });
    setInterval(() => {
      detect(net);
    }, 500);
  };

  const detect = async (net: posenet.PoseNet) => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width
      video.width = videoWidth;
      video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);

      EyeMovementDetect(pose["keypoints"], 0.8);
      EarsDetect(pose["keypoints"], 0.8); // Call the ear movement detection as well
    }
  };

  // Eye Movement Detection
  const EyeMovementDetect = (
    keypoints: posenet.Keypoint[],
    minConfidence: number
  ) => {
    const keypointEyeL = keypoints[1]; // Left Eye
    const keypointEyeR = keypoints[2]; // Right Eye

    // Check confidence of both eyes
    if (
      keypointEyeL.score > minConfidence &&
      keypointEyeR.score > minConfidence
    ) {
      const currentEyePositions = {
        leftEye: { x: keypointEyeL.position.x, y: keypointEyeL.position.y },
        rightEye: { x: keypointEyeR.position.x, y: keypointEyeR.position.y },
      };

      // Compare with previous positions
      if (
        prevEyePositions.leftEye.x !== null &&
        prevEyePositions.rightEye.x !== null
      ) {
        const movementLeft = getMovement(
          prevEyePositions.leftEye,
          currentEyePositions.leftEye
        );
        const movementRight = getMovement(
          prevEyePositions.rightEye,
          currentEyePositions.rightEye
        );

        if (
          movementLeft.direction === movementRight.direction &&
          movementLeft.direction !== "none"
        ) {
          swal(`Your eyes moved ${movementLeft.direction}`);
        }
      }

      // Update previous eye positions
      setPrevEyePositions(currentEyePositions);
    }
  };

  // Ear Movement Detection
  const EarsDetect = (keypoints: posenet.Keypoint[], minConfidence: number) => {
    const keypointEyeL = keypoints[1]; // Left Eye
    const keypointEyeR = keypoints[2]; // Right Eye
    const keypointEarL = keypoints[4]; // Left Ear
    const keypointEarR = keypoints[3]; // Right Ear

    // Check confidence of eyes and ears
    if (
      keypointEyeL.score > minConfidence &&
      keypointEyeR.score > minConfidence &&
      keypointEarL.score > minConfidence &&
      keypointEarR.score > minConfidence
    ) {
      const eyeMidpoint = {
        x: (keypointEyeL.position.x + keypointEyeR.position.x) / 2,
        y: (keypointEyeL.position.y + keypointEyeR.position.y) / 2,
      };

      const angleLeft = Math.atan2(
        keypointEarL.position.y - eyeMidpoint.y,
        keypointEarL.position.x - eyeMidpoint.x
      );
      const angleRight = Math.atan2(
        keypointEarR.position.y - eyeMidpoint.y,
        keypointEarR.position.x - eyeMidpoint.x
      );

      const angleThreshold = Math.PI / 6; // 30 degrees

      if (angleLeft < -angleThreshold) {
        swal("You looked away from the Screen (To the Left)");
      }
      if (angleRight > angleThreshold) {
        swal("You looked away from the Screen (To the Right)");
      }
    }
  };

  // Calculate eye movement direction
  const getMovement = (
    prevPosition: { x: number | null; y: number | null },
    currentPosition: { x: number; y: number }
  ) => {
    const dx = currentPosition.x - (prevPosition.x || 0);
    const dy = currentPosition.y - (prevPosition.y || 0);

    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (Math.abs(dx) > Math.abs(dy)) {
        return { direction: dx > 0 ? "right" : "left" };
      } else {
        return { direction: dy > 0 ? "down" : "up" };
      }
    }

    return { direction: "none" };
  };

  useEffect(() => {
    runPosenet();
  }, []);

  return (
    <div className="container mx-auto flex justify-center items-center">
      <div className="relative w-[640px] h-[200px] overflow-hidden rounded-lg shadow-md">
        <Webcam
          ref={webcamRef}
          className="w-full h-full object-cover rounded-lg"
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
};

export default WebCamera;
