// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Cert {
    address[] public admins;
    event Issued(string course, uint256 id, string grade);
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

    struct Certificate {
        string name;
        string course;
        string grade;
        string date;
    }

    mapping(uint256 => Certificate) public Certificates;
    mapping(uint => uint256) index;
    uint NumCert;

    modifier newID(uint256 _id)
    {
        bool NewID = true;
        for(uint i=0; i<NumCert;i++)
        {
            if(index[i] == _id)
            {
                NewID = false;
                break;
            }
        }
        require(NewID == true, "A certificate has already been issued with this ID.");
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
        string memory _course,
        string memory _grade,
        string memory _date
    ) public onlyAdmin newID(_id){
        Certificates[_id] = Certificate(_name, _course, _grade, _date);
        index[NumCert++] = _id;
        emit Issued(_course, _id, _grade);
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