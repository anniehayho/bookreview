import {React, useEffect, useState} from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import NoteCard from '../components/NoteCard';
import SelectStatus from '../components/SelectStatus';
import BookCard from '../components/BookCard';
import CommentCard from '../components/CommentCard';
import NotePopup from '../components/NotePopup'
import '../styles/Profile.css'
import UserImagePopup from '../components/UserImagePopup';
import { Link } from "react-router-dom";


export default function Profile() {
  
  const { isAuthenticated, user } = useAuth0();
  //modal shows up
  // const [show, setShow] = useState(false)
  const [show, setShow] = useState({
    "notePopup" : false,
    "imagePopup" : false
  })
  //stores data from 3 tables
  const [allActions, setAllActions] = useState([])
  //dropdown menu
  const [selectStatus, setSelectStatus] = useState("")

  const [bookIds, setBookIds] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([])
  const [allBooksOfUser, setAllBooksOfUser] = useState([])

  const [activeTab, setActiveTab] = useState('books');

  //gets all infos from 3 tables
  async function getUserAllActions(id) {

    try {
      const response = await fetch(`http://localhost:1212/api/profile/${id}`);

      const allActions = await response.json();
      setAllActions(allActions);

    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if(isAuthenticated) {
      getUserAllActions(user.sub);
    }
  }, [isAuthenticated, user]); 

  
  function handleSelect (event) {

    const value = event.target.value;
    setSelectStatus(value)
    setActiveTab('books')
  }


  function getBookIdBySelectStatus(selectStatus, data){

    let shelf_status; 

    switch (selectStatus) {
      case "read":
        shelf_status = 0
      break;
      case "to-read":
        shelf_status = 1
      break;
      case "currently-reading":
        shelf_status = 2
      break;
    }
    
    const filteredData = data.filter((item) => item.shelf_status === shelf_status)
    
    const bookIds = filteredData.map(item => item.api_id)

    return bookIds
  }

  useEffect(() => {
    const ids = getBookIdBySelectStatus(selectStatus, allActions)
    setBookIds(ids)
  }, [selectStatus]);


  //Get specific book info
  async function getBookById() {
   
    try {

      const bookPromises = bookIds.map(async id => {

        const response = await fetch(`http://localhost:1212/api/${id}`);
        return await response.json();
      });
  
      // waits for all the fetch calls to resolve
      const booksDetails = await Promise.all(bookPromises);
      setFilteredBooks(booksDetails.flat()) //removes one level of nesting
    
    } catch (error) {
      console.error('Error fetching multiple books:', error);
    }
  }

  useEffect(() => {
   getBookById()
  }, [bookIds]);


  //implements the current changes to the page immediately
  function handleCommentUpdated(){
    getUserAllActions(user.sub);
  }
  function handleNoteUpdated(){
    getUserAllActions(user.sub);
  }
  function handleImageUpdated(){
    getUserAllActions(user.sub);
  }

  //books in the user's library
  async function getAllBooksOfUser() {

    try {
      const bookPromises = allActions.map(async item => {

        const response = await fetch(`http://localhost:1212/api/${item.api_id}`);
        const bookData = await response.json();
        return bookData;
      });
  
      // waits for all the fetch calls to resolve
      const booksDetails = await Promise.all(bookPromises);
      setAllBooksOfUser(booksDetails) //removes one level of nesting
      
    } catch (error) {
      console.error('Error fetching multiple books:', error);
    }
  }

  useEffect(() => {
    if (allActions.length > 0) {
      getAllBooksOfUser();
    }
  }, [allActions]);


  return (
    <div className='profile-page'>

      <div className='subBar-profile-page'>

        <img 
          style={{ width: '128px', height: '128px', borderRadius: '50%' }} 
          src={allActions[0]?.image}  onClick={() => {setShow(prevValue => ({...prevValue, "imagePopup": true}))}}
        />

        <SelectStatus value={selectStatus} onChange = {handleSelect}/>

        <Link style={{textDecoration: 'none', color: 'inherit'}}onClick={()=> setActiveTab('comments')}>Comments</Link>
        <Link style={{textDecoration: 'none', color: 'inherit'}}onClick={()=> setActiveTab('notes')}>Notes</Link>
        <Link style={{textDecoration: 'none', color: 'inherit'}}onClick={() => {setShow(prevValue => ({...prevValue, "notePopup": true}))}}>Add Note</Link>
      </div>


      <div className='books-grid'>

        {
          (activeTab === 'books') &&
          filteredBooks.map((book) => {

            const action = allActions.find(action => action.api_id === book?.id);
            
            const isFaved = action ? action.isfavorite : false;
            const status = action ? action.shelf_status : undefined;

            return (
              
              <BookCard 
                key={book?.id} 
                title={book.volumeInfo.title}
                author={book.volumeInfo.authors}
                img={book.volumeInfo.imageLinks?.thumbnail}
                category={book.volumeInfo.categories[0]}
                id={book?.id}
                faved={isFaved}
                status={status}
              />
            );
          })
        }

      </div>
      
    
      {
        (activeTab === 'comments') &&
        allActions.filter((item) => item.comment_id !== null)
        .map((item, index) => {

          const book = allBooksOfUser.find(book => book?.id === item.api_id)
          const bookName = book.volumeInfo.title

          return (
            <CommentCard 
              key = {index}
              text = {item.text}
              userName={bookName}
              date = {item.date}
              rating={item.rate}
              icon = {true}
              commentId = {item.comment_id}
              onCommentUpdated={handleCommentUpdated}
              userImage = {allActions[0]?.image}
            />
          )
        })
      }


      {
        (activeTab === 'notes') &&
        allActions.filter((item) => item.note !== null)
        .map((item, index) => {

          const book = allBooksOfUser.find(book => book?.id === item.api_id)
          const bookName = book.volumeInfo.title

          return (
            <NoteCard 
              key = {index}
              note = {item.note}
              name = {bookName}
            />
          )
        })
      }
      

      {
        show.notePopup && 
        <NotePopup 
          show={show.notePopup}
          onClose={()=> setShow(prevValue => ({...prevValue, "notePopup": false}))}
          books = {allBooksOfUser}
          feeds = {allActions}
          noteUpdated={handleNoteUpdated}
        />
      }

      {
        show.imagePopup && 
        <UserImagePopup
          show={show.imagePopup}
          onClose={()=> setShow(prevValue => ({...prevValue, "imagePopup": false}))}
          userInfo={user.email}
          onImageUpdated = {handleImageUpdated}
        />
      }

    </div>
  )
}

