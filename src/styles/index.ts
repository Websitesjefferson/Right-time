import styled from 'styled-components';

export const Main = styled.main`
  

  @media (max-width: 720px) {
    font-size: 87.5%;
    
  }

  .slider {
    width: 100%; /* Defina a largura desejada para o slider */
    overflow: hidden;
    margin-top: 10px; 
  }
  
  .slider > div {
    display: flex;
    gap: 10px;
    animation: slide 40s linear infinite; /* 10s é a duração da animação, ajuste conforme necessário */
  }
  
  @keyframes slide {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%); /* Desloca a div para a esquerda */
    }
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
    align-items: center;
    margin-bottom: 4.125rem;
    justify-content: space-between;
    
    div{
      display: flex; 
      gap: 5px

      span{
        display: flex;
        flex-direction: row;
      }
    }
  }

  @media (max-width: 600px) {
    header{
      flex-direction: column; 
    }
    
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
