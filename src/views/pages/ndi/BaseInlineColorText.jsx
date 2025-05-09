import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const BaseInlineColorText = ({ first, mid, last, style, linkLabel, ix, sx, textAlign }) => {
    return (
        <Typography textAlign={textAlign} style={{ fontSize: '15px' }} color='rgba(128, 128, 128, 0.5)'>
            <strong>{first}</strong>
            <span style={{ ...style }}>{mid}</span> <strong>{last}</strong>
            <Link
                {...ix}
                sx={{
                    ...sx,
                    color: '#0000FF',
                    fontSize: '15px',
                    textDecoration: 'underline',
                    textDecorationColor: '#0000FF'
                }}
            >
                {linkLabel}
            </Link>
        </Typography>
    );
};

export default BaseInlineColorText;

BaseInlineColorText.propTypes = {
    ix: PropTypes.object,
    sx: PropTypes.object,
    style: PropTypes.object,
    first: PropTypes.string.isRequired,
    mid: PropTypes.string.isRequired,
    last: PropTypes.string.isRequired,
    linkLabel: PropTypes.string,
    textAlign: PropTypes.string
};