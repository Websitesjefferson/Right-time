import styled from 'styled-components';

export const Container = styled.aside`
  
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:  20px;
  background: #1e213a;
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }

  img{
    width: 200px;

  }
`;
export const ContainerInput = styled.div`
   width: 45%;
   display: flex;
   padding: 6px;
   border-radius: 10px;
   background: #a09fb1;
   
   margin-inline: 20px;

  button{
    display: flex;
    align-items: center;
    background: transparent;
    opacity: .5;
    transition: 300ms ease;
  }
  button:hover{
    opacity: .9;
  }

  

`
export const InputSearch = styled.input`
   width: 100%;
   background: transparent;
   outline: none;
   border: none;  
   padding: 6px;
`


export const WeatherInfo = styled.section`
  display: flex;
  align-items: center;
  gap: 5px;
  
  
  img {
    width: 50px
    
  }
  h1 {
    font-weight: 500;
    font-size: 30px;
   
    span {
      font-weight: 400;
      font-size: 16px;
      color: #a09fb1;
    }
  }
  h2 {
   
    font-weight: 600;
    font-size: 16px;
    color: #a09fb1;
    text-transform: capitalize;
  }

`;
export const City = styled.div`
  display: flex;
  align-items: center;
 
  gap: 0.5rem;
  color: #88869d;
  p {
    font-weight: 600;
    font-size: 1.125rem;
    text-transform: uppercase;
    
  }
`;
