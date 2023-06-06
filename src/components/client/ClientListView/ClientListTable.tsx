import { useEffect, useState } from 'react';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  InputAdornment,
  CircularProgress,
  Link,
  makeStyles,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';

import { isUndefined } from 'lodash';
import SearchIcon from 'src/icons/Search';
import { clientApi } from 'src/api/clientApi';
import capitalize from 'src/utils/capitalize';
import Scrollbar from '../../Scrollbar';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import logger from 'src/utils/logger';
import toast from 'react-hot-toast';
import DeleteModal from './DeleteModal';

import {
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
} from 'react-feather';
import jwtDecode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '4px !important',
    '& .MuiTableCell-root': {
      paddingTop: 8.5,
      paddingBottom: 8.5,
    },
    '& .MuiToolbar-root': {
      minHeight: 60,
    },
    '& .css-15fev7r-MuiGrid-root': {
      display: 'block'
    },
    '& .MuiNativeSelect-select': {
      padding: '9.5px 14px',
      color: '#263238',
      fontWeight: 500,
      '& option': {
        color: '#263238',
        fontWeight: 400,
      },
    },
    '& .MuiTableRow-root': {
      cursor: 'pointer',
    },
  },
  addNewClient: {
    textTransform: 'uppercase',
    borderRadius: 4,
    border: `1px solid ${theme.palette.secondary.main}`,
    boxShadow: 'none',
    '& + &': {
      marginLeft: theme.spacing(1)
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      background: theme.palette.background.default,
    }
  },
  filterButtonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    right: 36,
    [theme.breakpoints.down('sm')]: {
      right: 0,
    }
  },
  resetFiltersButton: {
    textTransform: 'uppercase',
    borderRadius: 4,
    height: 42,
    width: 220,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.secondary.main}`,
    '& + &': {
      marginLeft: theme.spacing(1)
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      background: theme.palette.background.default,
    }
  },
  deleteButton: {
    textTransform: 'uppercase',
    borderRadius: 4,
    border: '1px solid #B0BEC5',
    background: 'white !important',
    color: '#172b4d',
    width: 110,
    boxShadow: 'none',
    padding: theme.spacing(1),
    '& path': {
      fill: '#172b4d',
    },
    '& + &': {
      marginLeft: theme.spacing(1)
    },
  },
  card: {
    borderRadius: '5px',
  },
  tab: {
    paddingTop: 35,
    paddingBottom: 15,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 5,
      paddingBottom: 0,
    },
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 37,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
      flexDirection: 'column',
    }
  },
  searchBoxWrapper: {},
  searchBox: {
    padding: 10,
    borderRadius: 4,
    height: 42,
    width: 250,
  },
  statusOnline: {
    background: '#daf6de',
    width: '50%',
    padding: '4px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  statusTableCellOnline: {
    color: '#4CAF50',
    fontWeight: 500,
    fontStyle: 'normal',
    fontFamily: 'Roboto',
  },
  status: {
    width: '100%',
    padding: '5px 4px 4px',
    borderRadius: '4px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  activeStatus: {
    backgroundColor: 'rgb(232, 245, 233)',
    color: 'rgb(76, 175, 80)',
  },
  deActiveStatus: {
    backgroundColor: 'rgba(255, 87, 86, .2)',
    color: 'rgb(255, 87, 86)',
  },
  statusWrapper: {
    color: '#F57C00',
    fontWeight: 500,
    fontStyle: 'normal',
    fontFamily: 'Roboto',
  },
  viewBtn: {
    width: 90,
    borderRadius: '4px',
    fontSize: '14px',
    color: '#A1A1A1',
    fontWeight: 500,
    fontStyle: 'normal',
    fontFamily: 'Roboto',
    padding: '6px 10px',
    border: '1.8px solid #A1A1A1',
    textAlign: 'center',
    boxShadow: 'none'
  },
  viewTableColumnHeader: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    justifyContent: 'flex-start',
    width: '100%',
  },
  viewIcon: {
    marginRight: '10px'
  },
  filterWrapper: {
    display: 'flex',
    // padding: '20px 0px 25px 20px',
  },
  filterMain: {
    display: 'flex',
    width: '100%',
    justifyContent: 'end',
    alignItems: 'center',
    padding: '10px 25px 10px 0px',
  },
  dropDownWrapper: {
    display: 'flex',
    width: '15rem',
    borderRadius: '4px',
    marginRight: '0px !important',
  },
  dropDownText: {
    marginRight: 60,
    fontWeight: 500,
    fontStyle: 'normal',
    fontFamily: 'Roboto',
    fontSize: '14px',
    textAlign: 'center',
    display: 'inline-block',
  },
  dropDown: {
    width: '100%',
    '&:active': {
      outline: 'none',
      cursor: 'pointer',
    },
    padding: '8px 14px !important',
    '& + &': {
      marginLeft: theme.spacing(1),
      borderColor: 'blue',
    },
  },
  dropDownIcon: {

  },
  select: {
    marginRight: '10px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center'
  },
  selectBorderRadius: {
    borderRadius: 4,
  },
  firstTd: {
    paddingLeft: 45,
  },
  lastTd: {
    paddingRight: 45,
  },
  tablePagination: {
    paddingRight: '27px !important',
  },
  noRecordFound: {
    textAlign: 'center',
  },
  activeDateRange: {
    display: 'block',
    position: 'absolute',
    boxShadow:
      '0px 0px 0px rgba(63, 63, 68, 0.05), 0px 0px 4px rgba(63, 63, 68, 0.2)',
    zIndex: 1
  },
  deActiveDateRange: {
    display: 'none !important'
  },
  dateRangeSelection: {
    position: 'relative',
    top: '-8rem',
    border: '1px solid #eee',
    paddingTop: 35,
    background: 'white',
    margin: '0 auto',
    textAlign: 'center',
    boxShadow:
      '0px 0px 0px rgba(63, 63, 68, 0.05), 0px 0px 4px rgba(63, 63, 68, 0.2)',
    [theme.breakpoints.down('sm')]: {
      position: 'initial',
      border: 'none',
      margin: 'unset',
      boxShadow: 'none',
    }
  },
  textField: {
    '& .MuiInputBase-input': {
      padding: '10px 20px',
    },
  },
  searchIcon: {
    color: '#263238'
  },
  loadingCircle: {
    color: '#DF1683',
    width: '20px !important',
    height: '20px !important',
    marginLeft: 5,
    marginRight: 5
  },
  tableCell: {
    cursor: 'pointer',
    height: '64.5px',
  },
  chevronIcon: {
    position: 'relative',
    top: 6,
    left: 20,
    width: 24
  },
  isSortedColumn: {
    position: 'relative',
    top: '-4px',
  },
}));

const ClientListTable: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);

  const clients: any [] = [
    {
      id: 0,
      client_name: 'Azeem',
      client_email: 'azeemsult4n@gmail.com',
      client_city: 'Lahore',
      client_country: 'Pakistan',
      client_is_activated: false
    },
    {
      id: 1,
      client_name: 'Qasim',
      client_email: 'qasim@gmail.com',
      client_city: 'Islamabad',
      client_country: 'Pakistan',
      client_is_activated: false
    },
    {
      id: 0,
      client_name: 'Joe',
      client_email: 'Joe@gmail.com',
      client_city: 'Lahore',
      client_country: 'Pakistan',
      client_is_activated: false
    },
    {
      id: 0,
      client_name: 'John',
      client_email: 'John@gmail.com',
      client_city: 'Lahore',
      client_country: 'Pakistan',
      client_is_activated: false
    },
  ];

  const tabs = [
    {
      label: t('clients_all'),
      value: -1,
    },
    {
      label: t('clients_active'),
      value: 1,
    },
    {
      label: t('clients_inactive'),
      value: 0,
    },
  ];

  const [currentTab, setCurrentTab] = useState<string>();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  // const [clients, setClients] = useState<ClientList[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<boolean>(false);

  const [sortColumn, setSortColumn] = useState({
    name: false,
    address: false,
    is_activated: false,
    total_devices: false,
    created_at: false,
  });

  const handleSortColumn = (column) => {
    switch (column) {
      case 'name': {
        setSortColumn({
          name: true,
          address: false,
          is_activated: false,
          total_devices: false,
          created_at: false,
        });
        setSortDirection(!sortDirection);
        break;
      }
      case 'address': {
        setSortColumn({
          name: false,
          address: true,
          is_activated: false,
          total_devices: false,
          created_at: false,
        });
        setSortDirection(!sortDirection);
        break;
      }
      case 'total_devices': {
        setSortColumn({
          name: false,
          address: false,
          is_activated: false,
          total_devices: true,
          created_at: false,
        });
        setSortDirection(!sortDirection);
        break;
      }
      case 'is_activated': {
        setSortColumn({
          name: false,
          address: false,
          is_activated: true,
          total_devices: false,
          created_at: false,
        });
        setSortDirection(!sortDirection);
        break;
      }
      case 'created_at': {
        setSortColumn({
          name: false,
          address: false,
          is_activated: false,
          total_devices: false,
          created_at: true,
        });
        setSortDirection(!sortDirection);
        break;
      }
      default: {
        setSortColumn({
          name: false,
          address: false,
          is_activated: false,
          total_devices: false,
          created_at: false,
        });
        setSortDirection(!sortDirection);
        break;
      }
    }
    setIsSubmitting(true);
  };

  const getAll = async () => {
    if (isSubmitting) {
      try {
        const res = await clientApi.getAll(page, limit, currentTab, search, sortColumn, sortDirection);
        // setClients(res?.data);
        setTotalCount(res?.totalCount);
        setIsSubmitting(false);
      } catch (err) {
        logger(err, 'error');
        setIsSubmitting(false);
        // setClients([]);
        setTotalCount(0);
      }
    }
  };

  useEffect(() => {
    getAll();
  }, [page, limit, currentTab, sortDirection, isSubmitting]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
    setIsSubmitting(true);
  };

  const handleSelectAllClients = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedClients(event.target.checked
      ? clients.map((client) => client?.client_client_id)
      : []);
  };

  const handleSelectOneClient = (
    clientId: string
  ): void => {
    if (!selectedClients.includes(clientId)) {
      setSelectedClients((prevSelected) => [...prevSelected, clientId]);
    } else {
      setSelectedClients((prevSelected) => prevSelected.filter((id) => id !== clientId));
    }
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
    setIsSubmitting(true);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
    setIsSubmitting(true);
  };

  const selectedSomeClients = selectedClients.length > 0
    && selectedClients.length < clients.length;
  const selectedAllClients = clients.length > 0 ? selectedClients.length === clients.length : false;

  const navigateToViewClient = (e, customerId: string): void => {
    if (isUndefined(e.target.value)) {
      navigate(`/admin/clients/${customerId}`);
    }
  };

  const deActiveClient = async (clientId: string, isActive: number) => {
    try {
      await clientApi.deActivate(clientId, isActive);
      const msg = isActive ? t('client_deactivated_message') : t('client_activated_message');
      if (isActive) {
        toast.dismiss();
        toast.error(msg, {
          duration: 10000,
        });
      } else {
        toast.dismiss();
        toast.success(msg, {
          duration: 10000,
        });
      }
      setIsSubmitting(true);
      navigate('/admin/clients');
    } catch (err) {
      logger(err, 'error');
      // setClients([]);
      setTotalCount(0);
    }
  };

  const handleStatusChange = (event, clientId: string, isActive: number): void => {
    event.stopPropagation();
    deActiveClient(clientId, isActive);
  };

  const handleChange = (event) => {
    const searchTerm = event?.target?.value;
    setSearch(searchTerm);
    if (searchTerm?.length === 0 && event.key !== 'Enter') {
      setIsSubmitting(true);
    }
  };

  const handleSearch = (event) => {
    event.persist();
    if (event.key === 'Enter') {
      setIsSubmitting(true);
    }
  };
  const openModal = () => {
    if (selectedClients?.length > 0) {
      setOpenDeleteModal(true);
    } else {
      setOpenDeleteModal(false);
      const msg = t('clients_bulk_no_user_is_selected_error_message');
      toast.dismiss();
      toast.error(msg, {
        duration: 10000,
      });
    }
  };

  const [isFortesAdmin, setIsFortesAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')?.length > 0) {
      const decoded: any = jwtDecode(localStorage.getItem('accessToken'));
      const roles = decoded?.realm_access?.roles;
      setIsFortesAdmin(roles?.includes('fortes_admin'));
    }
  }, []);

  return (
    <Card
      className={classes.root}
    >
      <div className={classes.tableHeader}>
        <Tabs
          indicatorColor="secondary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={currentTab}
          variant="scrollable"
          className={classes.tab}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            px: 3,
            py: 2
          }}
          className={classes.searchBoxWrapper}
        >
          <TextField
            size="small"
            InputProps={{
              classes: {
                root: classes.searchBox
              },
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  { isSubmitting ? (<CircularProgress className={classes.loadingCircle} />) : <SearchIcon className={classes.searchIcon} />}
                </InputAdornment>
              )
            }}
            onKeyPress={handleSearch}
            onChange={handleChange}
            placeholder={t('clients_filter_search')}
            value={search}
            variant="outlined"
          />
        </Box>
      </div>
      {isFortesAdmin && (
        <>
          <Divider />
          <Grid
            className={clsx(classes.filterWrapper, classes.filterMain)}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              className={classes.filterButtonsWrapper}
            >
              <Button
                color="secondary"
                variant="contained"
                className={classes.deleteButton}
                onClick={() => openModal()}
              >
                {t('clients_filter_delete_button')}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      <Divider />
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  className={classes.firstTd}
                >
                  <Checkbox
                    checked={selectedAllClients}
                    color="primary"
                    indeterminate={selectedSomeClients}
                    onChange={handleSelectAllClients}
                  />
                </TableCell>
                <TableCell
                  className={clsx(classes.tableCell, {
                    [classes.isSortedColumn]: sortColumn?.name
                  })}
                  onClick={() => handleSortColumn('name')}
                >
                  {t('clients_table_name')}
                  {sortColumn?.name && sortDirection && (<ChevronUpIcon className={classes.chevronIcon} />)}
                  {sortColumn?.name && !sortDirection && (<ChevronDownIcon className={classes.chevronIcon} />)}
                </TableCell>
                <TableCell
                  className={clsx(classes.tableCell, {
                    [classes.isSortedColumn]: sortColumn?.address
                  })}
                  onClick={() => handleSortColumn('address')}
                >
                  {t('clients_table_country')}
                  {sortColumn?.address && sortDirection && (<ChevronUpIcon className={classes.chevronIcon} />)}
                  {sortColumn?.address && !sortDirection && (<ChevronDownIcon className={classes.chevronIcon} />)}
                </TableCell>
                <TableCell
                  className={clsx(classes.tableCell, {
                    [classes.isSortedColumn]: sortColumn?.total_devices
                  })}
                  onClick={() => handleSortColumn('total_devices')}
                >
                  {t('clients_table_devices')}
                  {sortColumn?.total_devices && sortDirection && (<ChevronUpIcon className={classes.chevronIcon} />)}
                  {sortColumn?.total_devices && !sortDirection && (<ChevronDownIcon className={classes.chevronIcon} />)}
                </TableCell>
                <TableCell
                  className={clsx(classes.tableCell, {
                    [classes.isSortedColumn]: sortColumn?.is_activated
                  })}
                  onClick={() => handleSortColumn('is_activated')}
                >
                  {t('clients_table_status')}
                  {sortColumn?.is_activated && sortDirection && (<ChevronUpIcon className={classes.chevronIcon} />)}
                  {sortColumn?.is_activated && !sortDirection && (<ChevronDownIcon className={classes.chevronIcon} />)}
                </TableCell>
                <TableCell
                  className={clsx(classes.tableCell, classes.lastTd, {
                    [classes.isSortedColumn]: sortColumn?.is_activated
                  })}
                  onClick={() => handleSortColumn('created_at')}
                >
                  {t('clients_table_added')}
                  {sortColumn?.created_at && sortDirection && (<ChevronUpIcon className={classes.chevronIcon} />)}
                  {sortColumn?.created_at && !sortDirection && (<ChevronDownIcon className={classes.chevronIcon} />)}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => {
                const isClientSelected = selectedClients.includes(client?.client_client_id);

                return (
                  <TableRow
                    hover
                    key={client?.client_client_id}
                    selected={isClientSelected}
                    onClick={(e) => navigateToViewClient(e, client?.client_client_id)}
                  >
                    <TableCell
                      padding="checkbox"
                      className={classes.firstTd}
                    >
                      <Checkbox
                        checked={isClientSelected}
                        color="primary"
                        onChange={() => handleSelectOneClient(
                          client?.client_client_id
                        )}
                        value={isClientSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Box>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to="/dashboard/clients/1"
                            variant="subtitle2"
                          >
                            {capitalize(client?.client_name)}
                          </Link>
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {client?.client_email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {`${capitalize(client?.client_city)}, ${capitalize(client?.client_country)}`}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {client?.deviceTotalCount || 0}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className={classes.statusWrapper}
                      onClick={(e) => handleStatusChange(e, client?.client_client_id, client?.client_is_activated)}
                    >
                      <div className={clsx(classes.status, {
                        [classes.activeStatus]: client?.client_is_activated,
                        [classes.deActiveStatus]: !client?.client_is_activated,
                      })}
                      >
                        { client?.client_is_activated ? t('active_label') : t('deactive_label') }
                      </div>
                    </TableCell>
                    <TableCell>
                      {moment(client?.client_created_at).format('DD MMM, YYYY')}
                    </TableCell>
                  </TableRow>
                );
              })}
              {clients?.length === 0 && (
                <TableRow
                  key="aa-12-2d-ac-xza"
                >
                  <TableCell
                    colSpan={6}
                    className={classes.noRecordFound}
                  >
                    {t('clients_no_record_found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <DeleteModal
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        clientsList={selectedClients}
      />

      <TablePagination
        className={classes.tablePagination}
        labelRowsPerPage={t('clients_table_row_per_page')}
        component="div"
        count={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Card>
  );
};

export default ClientListTable;
