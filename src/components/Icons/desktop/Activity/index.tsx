const Activity = ({ color }: any) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12H18L15 21L9 3L6 12H2" stroke={color || '#676B75'} strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="round"/>
    </svg>
  );
};

export default Activity;
