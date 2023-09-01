import styled from 'styled-components';

interface TemperatureValueProps {
  $isMinTemperature: boolean;
}

export const Container = styled.div`
  margin: auto ;
  height: 14rem;
  width: 90%;
  background: #1e213a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.125rem 1.375rem;
  gap: 12px;
  h4 {
    font-weight: 500;
    font-size: 1rem;
    line-height: 19px;
    text-align: center;
    color: #e7e7eb;
  }
  .temperatureValueContainer {
    display: flex;
    gap: 1rem;
  }
  @media (max-width: 400px) {
    height: 15.5rem;
    .temperatureValueContainer{
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 0px;
      
    }
  
  }
  
`;
export const TemperatureValue = styled.p<TemperatureValueProps>`
  font-weight: 500;
  font-size: 1rem;
  line-height: 19px;
  color: ${(props) => (props.$isMinTemperature ? '#A09FB1' : '#E7E7EB')};
`;
