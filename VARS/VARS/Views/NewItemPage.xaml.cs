using System;
using System.Collections.Generic;
using System.ComponentModel;
using VARS.Models;
using VARS.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace VARS.Views
{
    public partial class NewItemPage : ContentPage
    {
        public Item Item { get; set; }

        public NewItemPage()
        {
            InitializeComponent();
            BindingContext = new NewItemViewModel();
        }
    }
}