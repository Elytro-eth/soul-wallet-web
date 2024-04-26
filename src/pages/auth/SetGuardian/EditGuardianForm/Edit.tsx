import { useState, useRef, useEffect, Fragment } from 'react';
import { Box, Text, Image,  Menu, MenuList, MenuButton, MenuItem, Tooltip } from '@chakra-ui/react';
import Button from '@/components/Button'
import TextButton from '@/components/new/TextButton';
import { ethers } from 'ethers';
import MinusIcon from '@/assets/icons/minus.svg';
import DoubleFormInput from '@/components/new/DoubleFormInput';
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import PlusIcon from '@/components/Icons/Plus';
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';
import ENSResolver, { extractENSAddress } from '@/components/ENSResolver'
import { nanoid } from 'nanoid';

const getNumberArray = (count: number) => {
  const arr = [];

  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
};

const GuardianInput = ({
  id,
  values,
  showErrors,
  errors,
  guardianIds,
  onChange,
  onBlur,
  handleSubmit,
  removeGuardian,
  onChangeValues,
  i
}: any) => {
  const [isENSOpen, setIsENSOpen] = useState(false)
  const [isENSLoading, setIsENSLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('')

  const activeENSNameRef = useRef()
  const menuRef = useRef()
  const inputRef = useRef()

  const inputOnChange = (id: any, value: any) => {
    onChange(`address_${id}`)(value)
    setSearchText(value)

    if (extractENSAddress(value)) {
      setIsENSOpen(true)
    } else {
      setIsENSOpen(false)
    }
  }

  const inputOnFocus = (id: any, value: any) => {
    setSearchText(value)

    if (extractENSAddress(value)) {
      setIsENSOpen(true)
    } else {
      setIsENSOpen(false)
    }
  }

  const inputOnBlur = (id: any, value: any) => {
    if (value) {
      onBlur(`address_${id}`)(value)
    }
  }

  const setMenuRef = (value: any) => {
    menuRef.current = value
  }

  const setInputRef = (value: any) => {
    inputRef.current = value
  }

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value
  }

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !(inputRef.current as any).contains(event.target) && menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsENSOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress)
    setIsENSOpen(false)
    onChangeValues({
      [`name_${id}`]: name,
      [`address_${id}`]: resolvedAddress,
    })
  }

  return (
    <Box position="relative" key={id} width="100%">
      <DoubleFormInput
        leftPlaceholder={`Enter address or ENS`}
        leftValue={values[`address_${id}`]}
        leftOnChange={(value: any) => inputOnChange(id, value)}
        leftOnFocus={(value: any,) => inputOnFocus(id, value)}
        leftOnBlur={(value: any) => inputOnBlur(id, value)}
        setLeftInput={setInputRef}
        leftErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
        _leftInputStyles={{
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: 'Nunito'
        }}
        _leftContainerStyles={{
          width: { base: 'calc(100%)', 'md': 'calc(100% - 196px)' },
          marginBottom: { base: '18px', 'md': '0' },
          zIndex: 0
        }}

        rightAutoFocus={id === guardianIds[0]}
        rightPlaceholder="Guardian Name (optinal)"
        rightValue={values[`name_${id}`]}
        rightOnChange={onChange(`name_${id}`)}
        rightOnBlur={onBlur(`name_${id}`)}
        rightErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
        _rightContainerStyles={{
          width: { base: '100%', 'md': '196px' },
        }}
        _rightInputStyles={{
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: 'Nunito',
        }}

        onEnter={handleSubmit}
        _styles={{ width: '100%', fontSize: '16px' }}
      />
      {i > 0 && (
        <Box
          onClick={() => removeGuardian(id)}
          position="absolute"
          width="40px"
          right={{ base: '-28px', md: '-40px' }}
          top="0"
          height="48px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
        >
          <Icon src={MinusIcon} />
        </Box>
      )}
      <ENSResolver
        _styles={{
          width: { base: "100%", lg: "calc(100% - 196px - 16px)" },
          top: { base: "50px", lg: "50px" },
          left: { base: "0", lg: "0" },
          right: "0",
        }}
        isENSOpen={isENSOpen}
        setIsENSOpen={setIsENSOpen}
        isENSLoading={isENSLoading}
        setIsENSLoading={setIsENSLoading}
        searchText={searchText}
        setSearchText={setSearchText}
        searchAddress={searchAddress}
        setSearchAddress={setSearchAddress}
        resolvedAddress={resolvedAddress}
        setResolvedAddress={setResolvedAddress}
        setMenuRef={setMenuRef}
        submitENSName={submitENSName}
        setActiveENSNameRef={setActiveENSNameRef}
        getActiveENSNameRef={getActiveENSNameRef}
      />
    </Box>
  )
}

export default function Edit({
  guardianIds,
  guardiansList,
  values,
  onChange,
  onBlur,
  showErrors,
  errors,
  addGuardian,
  removeGuardian,
  handleSubmit,
  amountForm,
  amountData,
  loading,
  disabled,
  selectAmount,
  onChangeValues,
  formWidth,
  handleConfirm,
  handleBack,
  canGoBack,
  editType
}: any) {
  return (
    <Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          gap="12px"
          position="relative"
          width={formWidth || '100%'}
        >
          {guardianIds.map((id: any, i: number) => (
            <GuardianInput
              id={id}
              key={id}
              values={values}
              showErrors={showErrors}
              errors={errors}
              guardianIds={guardianIds}
              onChange={onChange}
              onBlur={onBlur}
              handleSubmit={handleSubmit}
              removeGuardian={removeGuardian}
              onChangeValues={onChangeValues}
              i={i}
            />
          ))}
          {editType !== 'editSingle' && (
            <TextButton onClick={() => addGuardian()} color="#FF2E79" _hover={{ color: '#FF2E79' }} _active={{ background: 'transparent' }} padding="2px">
              <PlusIcon color="#FF2E79" />
              <Text fontSize="16px" fontWeight="800" marginLeft="5px" color="#FF2E79">
                Add more guardians
              </Text>
            </TextButton>
          )}
        </Box>
      </Box>
      <Box
        background="white"
        height="100%"
        width="100%"
        roundedBottom="20px"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        marginTop="16px"
        borderTop="1px solid rgba(0, 0, 0, 0.1)"
        paddingTop="24px"
      >
        <Box
          display="flex"
          justifyContent="flex-start"
          marginTop="10px"
          alignItems="flex-start"
          flexDirection="column"
        >
          <Box
            fontFamily="Nunito"
            fontWeight="700"
            fontSize="14px"
            marginRight="6px"
          >
            Threshold
          </Box>
          <Box marginTop="2px">
            <TextBody
              type="t2"
              justifyContent="flex-start"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Box>Recovery wallet requires number of guardian(s) confirmation.</Box>
              <Box
                display="flex"
                alignItems="center"
                marginTop="14px"
              >
                <Box
                  width="80px"
                  marginRight="10px"
                >
                  <Menu>
                    <MenuButton
                      px={2}
                      py={2}
                      width="80px"
                      transition="all 0.2s"
                      borderRadius="16px"
                      borderWidth="1px"
                      padding="12px"
                      background="white"
                      _hover={{
                        borderColor: '#3182ce',
                        boxShadow: '0 0 0 1px #3182ce',
                      }}
                      _expanded={{
                        borderColor: '#3182ce',
                        boxShadow: '0 0 0 1px #3182ce',
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        {amountForm.values.amount || 0}
                        <DropDownIcon />
                      </Box>
                    </MenuButton>
                    <MenuList>
                      {!amountData.guardiansCount && (
                        <MenuItem key={nanoid(4)} onClick={selectAmount(0)}>
                          0
                        </MenuItem>
                      )}
                      {!!amountData.guardiansCount &&
                       getNumberArray(guardiansList.length || 0).map((i: any) => (
                         <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>
                           {i}
                         </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>

                </Box>
                <Box>{`out of ${guardiansList.length || 0} guardian(s) confirmation.`}</Box>
              </Box>
            </TextBody>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
