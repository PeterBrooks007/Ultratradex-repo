import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Box,
  Chip,
  styled,
} from '@mui/material';
import { Pen, Trash } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "green",
  '& .MuiTableCell-head': {
    color: "white",
    fontWeight: 'bold',
    fontSize: "18px"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

// Mock data for demonstration
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St, City, Country', age: 30, sex: 'Male', avatar: '/placeholder.svg?height=48&width=48', status: "online" },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Elm St, Town, Country', age: 28, sex: 'Female', avatar: '/placeholder.svg?height=48&width=48', status: "offline"  },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-555-5555', address: '789 Oak St, Village, Country', age: 35, sex: 'Male', avatar: '/placeholder.svg?height=48&width=48', status: "online"  },
  { id: 4, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St, City, Country', age: 30, sex: 'Male', avatar: '/placeholder.svg?height=48&width=48', status: "offline"  },
  { id: 5, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Elm St, Town, Country', age: 28, sex: 'Female', avatar: '/placeholder.svg?height=48&width=48', status: "offline" },
  { id: 6, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-555-5555', address: '789 Oak St, Village, Country', age: 35, sex: 'Male', avatar: '/placeholder.svg?height=48&width=48', status: "offline" },
];

export default function CurrenciesTable() {
  const [users, setUsers] = useState(initialUsers);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate()

  const handleEdit = (id) => {
    navigate(`/admin/user-details/1`)
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    setUsers(users.filter(user => user?.id !== id));
  };

  return (
    <StyledTableContainer component={Paper}>
      <Table aria-label="stylish user table">
        <StyledTableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Status</TableCell>
            {!isMobile && (
              <>
               
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Sex</TableCell>
              </>
            )}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user?.id}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <StyledAvatar src={user?.avatar} alt={user?.name} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user?.name}
                    </Typography>
                    {isMobile && (
                      <Typography variant="body2" color="textSecondary">
                        {user?.email} | {user?.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                    <Chip
                      label={user?.status}
                      color={user?.status === 'online' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
              {!isMobile && (
                <>
                  <TableCell>
                    <Typography variant="body2">{user?.email}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user?.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>{user?.address}</TableCell>
                  <TableCell>{user?.age}</TableCell>
                  <TableCell>
                    <Chip
                      label={user?.sex}
                      color={user?.sex === 'Male' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                </>
              )}
              <TableCell align="right">
                <ActionButton aria-label="edit" onClick={() => handleEdit(user?.id)}>
                  <Pen />
                </ActionButton>
                <ActionButton aria-label="delete" onClick={() => handleDelete(user?.id)}>
                  <Trash />
                </ActionButton>
              </TableCell>
            </StyledTableRow>
          ))}
          <Box p={2}>Pagination</Box>
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}