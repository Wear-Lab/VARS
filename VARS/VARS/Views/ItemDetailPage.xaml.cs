using System.ComponentModel;
using VARS.ViewModels;
using Xamarin.Forms;

namespace VARS.Views
{
    public partial class ItemDetailPage : ContentPage
    {
        public ItemDetailPage()
        {
            InitializeComponent();
            BindingContext = new ItemDetailViewModel();
        }
    }
}