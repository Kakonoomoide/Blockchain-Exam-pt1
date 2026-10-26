// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Guestbook {
    struct Entry {
        address sender;
        string name;
        string message;
        uint256 timestamp;
    }

    Entry[] private entries;

    event NewEntry(address indexed sender, string name, string message);

    // Tulis pesan baru
    function sign(string calldata _name, string calldata _message) public {
        require(bytes(_name).length > 0, "Nama tidak boleh kosong");
        require(bytes(_message).length > 0, "Pesan tidak boleh kosong");
        require(bytes(_name).length <= 50, "Nama max 50 karakter");
        require(bytes(_message).length <= 280, "Pesan max 280 karakter");

        entries.push(Entry(msg.sender, _name, _message, block.timestamp));
        emit NewEntry(msg.sender, _name, _message);
    }

    // Ambil satu entri berdasarkan index
    function getEntry(uint256 _index) public view returns (Entry memory) {
        require(_index < entries.length, "Index tidak ada");
        return entries[_index];
    }

    // Ambil semua entri
    function getAllEntries() public view returns (Entry[] memory) {
        return entries;
    }

    // Jumlah total entri
    function totalEntries() public view returns (uint256) {
        return entries.length;
    }
}
