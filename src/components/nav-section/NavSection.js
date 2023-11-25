import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
// ----------------------------------------------------------------------
import fieldData from '../../utils/pages.json';
import SvgColor from '../svg-color';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
        {Object.keys(fieldData).map((sectionName) => (
          <NavItem
            key={sectionName}
            item={{
              title: sectionName,
              path: sectionName,
              icon: <SvgColor src={`/assets/icons/ic_${sectionName}.svg`} sx={{ width: 1, height: 1 }} />,
            }}
          />
        ))}
        <NavItem key={Math.random()} item={{ title: 'Site Settings', path: 'settings' }} />
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
