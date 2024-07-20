// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract RecognitionAward {
    address[] public admins;
    event Issued(string award, uint256 id, string date);
    event AddedAdmin(address admin);
    event RevokedAdmin(address admin);

    constructor(address[] memory _admins) {
        admins.push(msg.sender);
        for(uint i=0; i<_admins.length; i++)
            admins.push(_admins[i]);
    }

    modifier onlyAdmin() {
        bool admin = false;
        for(uint i=0; i<admins.length; i++)
        {
            if(msg.sender == admins[i])
            {
                admin = true;
                break;
            }
        }
        require(admin == true, "Access Denied");
        _;
    }

    modifier isAdmin(address _admin) {
        bool admin = false;
        for(uint i=0; i<admins.length; i++)
        {
            if(_admin == admins[i])
            {
                admin = true;
                break;
            }
        }
        require(admin == true, "Not an admin");
        _;
    }

    struct Award {
        string name;
        string award;
        string description;
        string date;
    }

    mapping(uint256 => Award) public Awards;
    mapping(uint => uint256) index;
    uint NumAward;

    modifier newID(uint256 _id)
    {
        bool NewID = true;
        for(uint i=0; i<NumAward;i++)
        {
            if(index[i] == _id)
            {
                NewID = false;
                break;
            }
        }
        require(NewID == true, "An award has already been issued with this ID.");
        _;
    }

    modifier newAdmin(address _admin)
    {
        bool NewAdmin = true;
        for(uint i=0; i<admins.length;i++)
        {
            if(admins[i] == _admin)
            {
                NewAdmin = false;
                break;
            }
        }
        require(NewAdmin == true, "This address is already an admin.");
        _;
    }

    function issue(
        uint256 _id,
        string memory _name,
        string memory _award,
        string memory _description,
        string memory _date
    ) public onlyAdmin newID(_id){
        Awards[_id] = Award(_name, _award, _description, _date);
        index[NumAward++] = _id;
        emit Issued(_award, _id, _date);
    }

    function addAdmin(address admin) public onlyAdmin newAdmin(admin)
    {
        admins.push(admin);
        emit AddedAdmin(admin);
    }

    function revokeAdmin(address admin) public onlyAdmin isAdmin(admin)
    {
        uint j = 0;
        for(uint i=0; i<admins.length; i++)
        {
            if(admins[i] == admin)
                continue;
            admins[j] = admins[i];
            j++;
        }
        admins.pop();
        emit RevokedAdmin(admin);
    }
}