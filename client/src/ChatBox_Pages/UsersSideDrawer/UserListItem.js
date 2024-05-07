import { Avatar, Box,Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = (props) => {
  return (
    <Box
    onClick={props.handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background:"#bf74f7",
     transitionDuration:"0.1s",
     transitionTimingFunction:"ease-in",
     color:"white",
    }}
    w="100%"
    display="flex"
    alignItems="center"
    color="black"
    px={3}
    py={2}
    mb={2}
    mt={3}
    borderRadius="lg"
    >
    <Avatar mr={2} size="sm" cursor="pointer" name={props.user.name} src={props.user.pic}/>
    <Box>
        <Text>{props.user.name}</Text>
        <Text fontSize="xs"><b>Email : </b> {props.user.email}</Text>
    </Box>
    </Box>
  );
}

export default UserListItem
