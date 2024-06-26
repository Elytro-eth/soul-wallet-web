const Circle = ({ active }: any) => {
  if (active) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.2856 15.6001C25.2856 20.76 21.1026 24.943 15.9427 24.943C10.7828 24.943 6.59985 20.76 6.59985 15.6001C6.59985 10.4402 10.7828 6.25726 15.9427 6.25726C21.1026 6.25726 25.2856 10.4402 25.2856 15.6001Z" stroke="black" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.7856 15.6001C25.7856 21.0362 21.3788 25.443 15.9427 25.443C10.5067 25.443 6.09985 21.0362 6.09985 15.6001C6.09985 10.1641 10.5067 5.75726 15.9427 5.75726C21.3788 5.75726 25.7856 10.1641 25.7856 15.6001Z" stroke="#C9C9C9"/>
      <path d="M14.9052 20.3761C15.2768 20.3761 15.5782 20.1953 15.7991 19.8739L20.2891 12.8527C20.4197 12.6418 20.5402 12.4007 20.5402 12.1697C20.5402 11.6775 20.0982 11.346 19.6262 11.346C19.3248 11.346 19.0536 11.5067 18.8427 11.8482L14.875 18.2165L13.0067 15.836C12.7657 15.5246 12.5246 15.4141 12.2232 15.4141C11.7311 15.4141 11.3494 15.8058 11.3494 16.3081C11.3494 16.5491 11.4398 16.7701 11.6005 16.9811L13.9811 19.8739C14.2523 20.2255 14.5436 20.3761 14.9052 20.3761Z" fill="white" />
    </svg>
  );
};

export default Circle;