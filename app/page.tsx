'use client'
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
//sha commit

const Page = () => {
  return (
    <div className="background-video-container">
      {/* Background Video (replace "/path/to/your/video.mp4" with your video file path) */}
      <video autoPlay muted loop className="background-video">
        <source src="https://cdn.pixabay.com/video/2023/07/24/173104-848555587_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Container */}
      <div className="content-container">
        <h1 style={{color:"black",fontWeight:"900"}}>Welcome to the AI Model Marketplace</h1>
        {/* Corrected usage of Link */}
        <Link href="/messier-1/andromeda/marketplace">
        <Button colorScheme='purple' size="xl">Buy AI Models NFTs</Button>
        </Link>
      </div>

      {/* Styling */}
      <style jsx>{`
        .background-video-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content-container {
          text-align: center;
          z-index: 1; /* Ensure content appears above video */
        }
        .content-container {
            background: rgba(255, 255, 255, 0.2);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
border: 1px solid rgba(255, 255, 255, 0.3);
padding: 60px;
        }

        .get-started-button {
          display: inline-block;
          padding: 12px 24px;
          font-size: 18px;
          font-weight: bold;
          color: #ffffff;
          background-color: #007bff;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .get-started-button:hover {
          background-color: #0056b3;
        }

        h1 {
          font-size: 36px;
          color: #ffffff;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default Page;
