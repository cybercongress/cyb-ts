import React, { useEffect, useRef } from 'react';
import 'aframe';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-entity': any;
      'a-plane': any;
      'a-text': any;
      'a-image': any;
    }
  }
}

type Props = {
  node: any;
  camera: any;
  size: number;
  imageUrl?: string;
};

function HoverInfo({ node, camera, size, imageUrl }: Props) {
  const hoverRef = useRef(null);

//   useEffect(() => {
//     if (!node || !camera || !hoverRef.current) return;

//     const hoverEl = hoverRef.current;
    
//     // Position the hover info in 3D space
//     hoverEl.setAttribute('position', `${node.x} ${node.y} ${node.z}`);
    
//     // Make the hover info always face the camera
//     hoverEl.setAttribute('look-at', '[camera]');

//     // Update content
//     const textEl = hoverEl.querySelector('[text]');
//     if (textEl) {
//       textEl.setAttribute('text', 'value', node.id);
//     }

//     // Show/hide based on distance from camera
//     const updateVisibility = () => {
//       const distance = hoverEl.object3D.position.distanceTo(camera.position);
//       if (hoverEl.object3D) {
//         hoverEl.object3D.visible = distance < size;
//       }
//     };

//     // Add this to the render loop
//     (hoverEl as any).sceneEl.addBehavior({
//       tick: updateVisibility
//     });

//   }, [node, camera, size]);

  return (
    <a-entity ref={hoverRef}>
      <a-plane color="white" height="100" width="100">
        {imageUrl && (
          <a-image
            src={imageUrl}
            width="0.5"
            height="0.5"
            position="0 0.15 0.01"
          />
        )}
        <a-text 
          value={node.id}
          color="black"
          align="center" 
          width="1.1"
          position="0 -0.2 0.01"
        />
      </a-plane>
    </a-entity>
  );
}

export default HoverInfo;
