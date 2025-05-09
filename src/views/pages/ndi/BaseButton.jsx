import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const BaseButton = ({ label, onClick, endIcon, startIcon, sx, ix }) => {
    return (
        <Button sx={{ ...sx }} {...ix} onClick={onClick} startIcon={startIcon} endIcon={endIcon}>
            {label}
        </Button>
    );
};

export default BaseButton;

BaseButton.propTypes = {
    label: PropTypes.string.isRequired,
    sx: PropTypes.object,
    ix: PropTypes.object,
    onClick: PropTypes.func,
    endIcon: PropTypes.node,
    startIcon: PropTypes.node
};