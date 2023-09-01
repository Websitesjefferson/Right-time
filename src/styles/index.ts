import styled from 'styled-components';

export const Main = styled.main`
  

  @media (max-width: 720px) {
    font-size: 87.5%;
    
  }
`;

export const Section = styled.section`
  padding: 2rem;
  display: flex;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
  margin: auto;
  flex-direction: column;
 
  header {
    display: flex;
    gap: 0.75rem;
    align-items: start;
    margin-bottom: 4.125rem;
  }
`;

export const Footer = styled.footer`
  color: #a09fb1;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  margin-top: auto;
  span {
    text-decoration: underline;
    font-weight: 700;
  }
`;
