using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ISpotifyAccountService
    {
        Task<SpotifyAuthResult> GetTokens(string username, string code);
        Task Refresh(string refreshOn, string refreshType);

    }
}