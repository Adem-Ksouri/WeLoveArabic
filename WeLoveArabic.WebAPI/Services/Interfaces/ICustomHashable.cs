namespace WeLoveArabic.WebAPI.Services.Interfaces
{
    public interface ICustomHashable
    {
        int CustomHash(int cbase, int mod);

        bool IsEqual(object? obj);
    }
}
