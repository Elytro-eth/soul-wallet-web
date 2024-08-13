const Copy = ({ color }: any) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.4277 7.71439C11.6551 7.71439 11.8731 7.8047 12.0338 7.96544C12.1946 8.12619 12.2849 8.34421 12.2849 8.57153V14.2858C12.2849 14.5131 12.1946 14.7312 12.0338 14.8919C11.8731 15.0527 11.6551 15.143 11.4277 15.143H5.71345C5.48612 15.143 5.2681 15.0527 5.10736 14.8919C4.94661 14.7312 4.8563 14.5131 4.8563 14.2858V8.57153C4.8563 8.34421 4.94661 8.12619 5.10736 7.96544C5.2681 7.8047 5.48612 7.71439 5.71345 7.71439H11.4277ZM12.8419 7.15732C12.4669 6.78225 11.9582 6.57153 11.4277 6.57153H5.71345C5.18301 6.57153 4.67431 6.78225 4.29923 7.15732C3.92416 7.53239 3.71345 8.0411 3.71345 8.57153V14.2858C3.71345 14.8163 3.92416 15.325 4.29923 15.7C4.67431 16.0751 5.18301 16.2858 5.71345 16.2858H11.4277C11.9582 16.2858 12.4669 16.0751 12.8419 15.7C13.217 15.325 13.4277 14.8163 13.4277 14.2858V8.57153C13.4277 8.0411 13.217 7.53239 12.8419 7.15732Z" fill={color || 'rgba(0, 0, 0, 0.4)'} />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.6999 4.30014C15.3248 3.92507 14.8161 3.71436 14.2856 3.71436H8.57136C8.04093 3.71436 7.53222 3.92507 7.15715 4.30014C6.78207 4.67521 6.57136 5.18392 6.57136 5.71436V6.47066C6.57136 6.78625 6.8272 7.04209 7.14279 7.04209C7.45838 7.04209 7.71422 6.78625 7.71422 6.47066V5.71436C7.71422 5.48703 7.80452 5.26901 7.96527 5.10826C8.12601 4.94752 8.34403 4.85721 8.57136 4.85721H14.2856C14.513 4.85721 14.731 4.94752 14.8917 5.10826C15.0525 5.26901 15.1428 5.48703 15.1428 5.71436V11.4286C15.1428 11.656 15.0525 11.874 14.8917 12.0347C14.731 12.1955 14.513 12.2858 14.2856 12.2858H13.5293C13.2138 12.2858 12.9579 12.5416 12.9579 12.8572C12.9579 13.1728 13.2138 13.4286 13.5293 13.4286H14.2856C14.8161 13.4286 15.3248 13.2179 15.6999 12.8429C16.0749 12.4678 16.2856 11.9591 16.2856 11.4286V5.71436C16.2856 5.18392 16.0749 4.67521 15.6999 4.30014Z" fill={color || 'rgba(0, 0, 0, 0.4)'} />
    </svg>
  );
};

export default Copy;
