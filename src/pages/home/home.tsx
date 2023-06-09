import React, { useState } from 'react';
import { getGitUsers } from '../../fetchers/gitFetchers';
import { GitUser } from '../../typeDefs/gitTypes';
import UserCard from './UserCard';
import "./home.css";
import Loader from '../../components/Loader';

const Home = () => {
    const [searchText,setSearchText] = useState<string>("");
    const [searchedText,setSearchedText] = useState<string>("");

    const [users,setUsers] = useState<GitUser[]>([]);
    const [usersErr,setUsersErr] = useState<string|null>(null);
    const [isUsersLoading,setIsUsersLoading] = useState<Boolean>(false);
    
    

    const onChangeSearchHandler = (e:React.ChangeEvent<HTMLInputElement>):void => setSearchText(e.target.value);
    
    const handleUserSearch = async(username:string):Promise<void> =>{
        setIsUsersLoading(true);
        setUsersErr(null);
        const result = await getGitUsers(username);
        setSearchedText(searchText);
        setUsers(result.data)
        setUsersErr(result.errorMsg);
        setIsUsersLoading(false);     
    }

   const onSearchKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) =>{
        if (e.keyCode === 13) {
            handleUserSearch(searchText);
        }
   }

    return (
        <div className='container'>
            <div>
                <h2 className='head-title'>Git  Users and Repositories</h2>
                <div className='search'>
                    <input  onChange={onChangeSearchHandler} onKeyDown={onSearchKeyDown} type="search" name="" data-testid='search-input' value={searchText} placeholder='Enter username' />
                    {!isUsersLoading && <button onClick={()=>handleUserSearch(searchText)} data-testid='search-btn'>Search</button>}
                </div>
                {searchedText && !isUsersLoading && !!users?.length && <p className='search-status'>Showing users for "{searchedText}"</p>}

                <div>
                    {
                        isUsersLoading 
                        ? <div className='loader' data-testid='loader-user'><Loader /></div>
                        : users?.length === 0 && searchedText && !usersErr
                        ? <p className='text-center'>No user found</p>
                        : <div className='users' data-testid='users-test'>
                            {
                                users?.map((user:GitUser)=><UserCard user={user}  key={user.id} />)
                            }
                        </div>
                    }
                </div>
                {usersErr && <p className='errorMsg'>{usersErr}</p>}
            </div>
        </div>
    );
};

export default Home;