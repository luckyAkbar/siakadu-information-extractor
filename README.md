# SIAKADU INFORMATION EXTRACTOR

Siakadu is some kind of informational web app which used by all student whom studying at University of Lampung. This app consist of some information about the students, usually like GPA, semester, and some others.

This Server will serve some endpoint which can be use to extract information provided by Siakadu. Small notes to be taken here is, some information from Siakadu seems to be publicly avaliable, AKA everybody will be able to retrive it without anykind of auth. But, some information are only available if you're logged in as students. So, this server will have some endpoint in which will require you to supply your Siakadu account credentials in order to retrive the information.

## Technology
  1. TypeScript
  2. Express JS
  3. Node JS
  4. AWS EC2

## API CONTRACTS

### /public/student/photo/:NPM
  - GET
    1. required URL Params:
      - NPM -> stands for Nomor Pokok Mahasiswa, which is a unique identifier of each students.
    2. Return value:
      - type: images/* (most likely always jpg)
      - size: depends / not always same
      - image count: always 1.