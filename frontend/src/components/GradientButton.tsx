import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface GradientButtonProps extends ButtonProps {
  gradient?: string;
}

const StyledGradientButton = styled(Button)<GradientButtonProps>(({ gradient }) => ({
  background: gradient || 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const GradientButton: React.FC<GradientButtonProps> = ({ children, gradient, ...props }) => {
  return (
    <StyledGradientButton gradient={gradient} {...props}>
      {children}
    </StyledGradientButton>
  );
};

export default GradientButton;